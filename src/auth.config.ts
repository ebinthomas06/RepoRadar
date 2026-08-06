// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Edge-safe subset of the real config — no Prisma, no Node-only APIs.
// Middleware imports THIS file, not auth.ts, so it can run on the Edge Runtime.
export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
};