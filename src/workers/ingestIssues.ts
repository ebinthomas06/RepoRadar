// src/workers/ingestIssues.ts
import "dotenv/config";
import { prisma } from "@/lib/prisma";
import {
  isLanguageTag,
  searchIssuesByLanguage,
  searchReposByTopic,
  searchIssuesInRepo,
  fetchRepoDetails,
  type GithubIssueSearchItem,
} from "@/lib/github";
import { computeHealthScore } from "@/lib/repoHealth";

const TOKEN = process.env.GITHUB_INGESTION_TOKEN;

// GitHub's Search API is rate-limited to 30 requests/minute (much
// stricter than the 5000/hr core limit) — this pause keeps us safely
// under that between search calls.
const SEARCH_DELAY_MS = 2100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getAllDistinctTags(): Promise<string[]> {
  const rows = await prisma.userPreferences.findMany({
    select: { preferredTags: true },
  });
  const set = new Set<string>();
  for (const row of rows) {
    for (const tag of row.preferredTags) set.add(tag);
  }
  return [...set];
}

// Ensures a `repositories` row exists for this repo, fetching fresh
// details from GitHub if we've never seen it before. Returns the row's
// internal UUID (needed for the Issue upsert's foreign key).
async function ensureRepository(fullName: string): Promise<string | null> {
  const details = await fetchRepoDetails(TOKEN!, fullName);
  if (details.fork) return null;

  const row = await prisma.repository.upsert({
    where: { githubRepoId: BigInt(details.id) },
    update: {
      starsCount: details.stargazers_count,
      healthScore: computeHealthScore(details),
      language: details.language?.toLowerCase() ?? null,
      topics: details.topics ?? [],
      scrapedAt: new Date(),
    },
    create: {
      githubRepoId: BigInt(details.id),
      fullName: details.full_name,
      starsCount: details.stargazers_count,
      healthScore: computeHealthScore(details),
      language: details.language?.toLowerCase() ?? null,
      topics: details.topics ?? [],
    },
  });
  return row.id;
}

// Idempotent upsert — matches your schema's
// @@unique([repositoryId, githubNumber]) constraint exactly.
async function upsertIssue(repositoryId: string, item: GithubIssueSearchItem) {
  if (item.pull_request) return; // search API includes PRs — skip them

  await prisma.issue.upsert({
    where: {
      repo_github_number_unique: {
        repositoryId,
        githubNumber: item.number,
      },
    },
    update: {
      commentsCount: item.comments,
      isDirty: true, // flag for Phase 3 to recompute solvability
    },
    create: {
      repositoryId,
      githubNumber: item.number,
      title: item.title,
      htmlUrl: item.html_url,
      labels: item.labels.map((l) => l.name),
      commentsCount: item.comments,
      githubCreatedAt: new Date(item.created_at),
      isDirty: true,
    },
  });
}

async function processIssues(items: GithubIssueSearchItem[]) {
  for (const item of items) {
    if (item.pull_request) continue;
    if (item.user?.login?.endsWith("[bot]")) continue; // skip Renovate, Dependabot, etc.

    const fullName = item.repository_url.replace(
      "https://api.github.com/repos/",
      ""
    );
    const repoId = await ensureRepository(fullName);
    if (repoId) await upsertIssue(repoId, item);
  }
}

export async function runIngestion() {
  if (!TOKEN) {
    throw new Error("GITHUB_INGESTION_TOKEN is not set in .env");
  }

  const tags = await getAllDistinctTags();
  console.log(`Ingesting issues for ${tags.length} distinct tags:`, tags);

  for (const tag of tags) {
    try {
      if (isLanguageTag(tag)) {
        console.log(`[language] ${tag}`);
        const items = await searchIssuesByLanguage(TOKEN, tag);
        await processIssues(items);
      } else {
        console.log(`[topic] ${tag}`);
        const repos = await searchReposByTopic(TOKEN, tag, 5);
        for (const repo of repos) {
          await sleep(SEARCH_DELAY_MS);
          const items = await searchIssuesInRepo(TOKEN, repo.full_name);
          await processIssues(items);
        }
      }
    } catch (err) {
      console.error(`Failed processing tag "${tag}"`, err);
    }
    await sleep(SEARCH_DELAY_MS);
  }

  console.log("Ingestion complete.");
}

// Allows running this file directly: npx tsx src/workers/ingestIssues.ts
if (require.main === module) {
  runIngestion()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}