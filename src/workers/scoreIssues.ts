// src/workers/scoreIssues.ts
import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { fetchOpenPRCountForIssue } from "@/lib/github";
import { computeSolvabilityScore } from "@/lib/solvability";

const TOKEN = process.env.GITHUB_INGESTION_TOKEN;

// Search API is capped at 30 req/min — this keeps us safely under that.
const SEARCH_DELAY_MS = 2100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function ageInDays(createdAt: Date): number {
  const ms = Date.now() - createdAt.getTime();
  return ms / (1000 * 60 * 60 * 24);
}

export async function runScoring() {
  if (!TOKEN) {
    throw new Error("GITHUB_INGESTION_TOKEN is not set in .env");
  }

  // On a first run everything needs scoring (fresh solvability_score = 0
  // default), so we don't filter strictly on is_dirty alone — we also
  // catch anything that's never been scored yet.
  const issues = await prisma.issue.findMany({
    where: {
      OR: [{ isDirty: true }, { solvabilityScore: 0 }],
      isOpen: true,
    },
    include: { repository: true },
  });

  console.log(`Scoring ${issues.length} issues...`);

  for (const issue of issues) {
    try {
      const openPRs = await fetchOpenPRCountForIssue(
        TOKEN,
        issue.repository.fullName,
        issue.githubNumber
      );

      const score = computeSolvabilityScore({
        ageDays: ageInDays(issue.githubCreatedAt),
        repoHealth: issue.repository.healthScore,
        activeComments: issue.commentsCount,
        openPRs,
      });

      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          solvabilityScore: score,
          openPrsCount: openPRs,
          isDirty: false,
        },
      });

      console.log(
        `  ${issue.repository.fullName}#${issue.githubNumber} -> score ${score} (openPRs: ${openPRs})`
      );
    } catch (err) {
      console.error(
        `Failed scoring ${issue.repository.fullName}#${issue.githubNumber}`,
        err
      );
    }
    await sleep(SEARCH_DELAY_MS);
  }

  console.log("Scoring complete.");
}

if (require.main === module) {
  runScoring()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}