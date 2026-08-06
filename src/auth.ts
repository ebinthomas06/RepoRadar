import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/crypto";
import { after } from "next/server";
import { buildInterestProfile } from "@/lib/profileService";

// FR-4.1: authenticate via GitHub OAuth 2.0, capturing username, avatar,
// and email. Session strategy is JWT (stateless) per the chosen design —
// no PrismaAdapter, no Session table. We do our own minimal persistence
// in the jwt callback below, which lets us control field mapping onto
// our HLD-shaped `users` table and encrypt tokens before they hit the DB.

async function fetchPrimaryGithubEmail(accessToken: string): Promise<string | null> {
  // GitHub only includes `email` in the OAuth profile if the user has a
  // public email set. Otherwise we look it up explicitly (requires the
  // `user:email` scope, requested below).
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const emails: Array<{ email: string; primary: boolean; verified: boolean }> =
    await res.json();
  const primary = emails.find((e) => e.primary && e.verified) ?? emails[0];
  return primary?.email ?? null;
}

const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      // `account` and `profile` are only present on the initial sign-in
      // request, not on every subsequent token refresh — this block is
      // where we create/update our own User + Account rows.
      if (account && profile) {
        const githubId = BigInt(String(profile.id));
        const username = (profile.login as string) ?? String(profile.id);
        const avatarUrl = (profile.avatar_url as string) ?? "";

        let email = (profile.email as string | null) ?? null;
        if (!email && account.access_token) {
          email = await fetchPrimaryGithubEmail(account.access_token);
        }
        if (!email) {
          throw new Error(
            "Could not read a verified email from GitHub. Grant email access and try again."
          );
        }

        const user = await prisma.user.upsert({
          where: { githubId },
          update: { username, avatarUrl, email },
          create: {
            githubId,
            username,
            avatarUrl,
            email,
            // user_preferences is 1:1 — create the row with schema
            // defaults so downstream matching queries never hit a null.
            preferences: { create: {} },
          },
        });

        if (account.access_token) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: "github",
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              accessTokenCipher: encryptToken(account.access_token),
              refreshTokenCipher: account.refresh_token
                ? encryptToken(account.refresh_token)
                : null,
              scope: account.scope ?? null,
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
            },
            create: {
              userId: user.id,
              provider: "github",
              providerAccountId: account.providerAccountId,
              accessTokenCipher: encryptToken(account.access_token),
              refreshTokenCipher: account.refresh_token
                ? encryptToken(account.refresh_token)
                : null,
              scope: account.scope ?? null,
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
            },
          });
        }

        token.userId = user.id;
        token.username = user.username;

        // Kick off interest profiling without blocking sign-in — this runs
        // after the response is sent, so the user isn't stuck waiting on
        // GitHub API calls before they land on the dashboard.
        after(() => buildInterestProfile(user.id));
      }

      return token;
    },

    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      if (token.username) session.user.username = token.username as string;
      return session;
    },
  },
  pages: {
    // Optional: point at a custom sign-in page once the UI exists.
    // signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);