// src/lib/digest.ts
import { prisma } from "@/lib/prisma";

const MAX_ISSUES_PER_DIGEST = 5;

export async function getDigestIssuesForUser(userId: string) {
  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  if (!prefs || prefs.preferredTags.length === 0) return [];

  // Issues this user has already been emailed — never send the same one twice.
  const alreadySent = await prisma.digestLog.findMany({
    where: { userId },
    select: { issueId: true },
  });
  const sentIds = alreadySent.map((d) => d.issueId);

  const issues = await prisma.issue.findMany({
    where: {
      isOpen: true,
      id: { notIn: sentIds },
      solvabilityScore: { gte: prefs.minSolvability },
      repository: {
        starsCount: { gte: prefs.minRepoStars },
        OR: [
          { language: { in: prefs.preferredTags } },
          { topics: { hasSome: prefs.preferredTags } },
        ],
      },
    },
    orderBy: { solvabilityScore: "desc" },
    include: { repository: true },
    take: MAX_ISSUES_PER_DIGEST,
  });

  return issues;
}