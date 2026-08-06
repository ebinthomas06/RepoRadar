// src/lib/profileService.ts
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/crypto";
import { fetchOwnedRepos, fetchStarredRepos } from "@/lib/github";

const OWNED_WEIGHT = 2;   // repos they built themselves — strongest signal
const STARRED_WEIGHT = 1; // repos they starred — weaker, but still real interest
const TOP_N_TAGS = 8;     // how many tags we keep

export async function buildInterestProfile(userId: string): Promise<void> {
  // Step 1: get their GitHub account row, which holds the encrypted token
  const account = await prisma.account.findFirst({
    where: { userId, provider: "github" },
  });

  if (!account) {
    console.warn(`No GitHub account found for user ${userId}, skipping profiling`);
    return;
  }

  // Step 2: decrypt it back to the raw token we need for GitHub API calls
  const accessToken = decryptToken(account.accessTokenCipher);

  // Step 3: fetch both repo lists in parallel; if one fails, don't kill the other
  const [owned, starred] = await Promise.all([
    fetchOwnedRepos(accessToken).catch((err) => {
      console.error("Failed to fetch owned repos", err);
      return [];
    }),
    fetchStarredRepos(accessToken).catch((err) => {
      console.error("Failed to fetch starred repos", err);
      return [];
    }),
  ]);

  // Step 4: tally language + topics into one map, lowercase so
  // "DevOps" and "devops" don't get counted as two different tags
  const tally = new Map<string, number>();

  function addTag(rawTag: string | null | undefined, weight: number) {
    if (!rawTag) return;
    const tag = rawTag.trim().toLowerCase();
    if (!tag) return;
    tally.set(tag, (tally.get(tag) ?? 0) + weight);
  }

  for (const repo of owned) {
    if (repo.fork) continue; // forked repos aren't really "their" interest
    addTag(repo.language, OWNED_WEIGHT);
    for (const topic of repo.topics ?? []) addTag(topic, OWNED_WEIGHT);
  }

  for (const repo of starred) {
    addTag(repo.language, STARRED_WEIGHT);
    for (const topic of repo.topics ?? []) addTag(topic, STARRED_WEIGHT);
  }

  // Step 5: sort by count, descending, keep the top N
  const topTags = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N_TAGS)
    .map(([tag]) => tag);

  if (topTags.length === 0) return; // nothing found — leave the defaults alone

  // Step 6: save into their preferences row
  await prisma.userPreferences.update({
    where: { userId },
    data: { preferredTags: topTags },
  });
}