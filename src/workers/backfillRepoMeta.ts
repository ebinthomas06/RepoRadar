// src/workers/backfillRepoMeta.ts
import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { fetchRepoDetails } from "@/lib/github";
import { computeHealthScore } from "@/lib/repoHealth";

const TOKEN = process.env.GITHUB_INGESTION_TOKEN;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function run() {
  if (!TOKEN) throw new Error("GITHUB_INGESTION_TOKEN is not set in .env");

  const repos = await prisma.repository.findMany();
  console.log(`Backfilling ${repos.length} repositories...`);

  for (const repo of repos) {
    try {
      const details = await fetchRepoDetails(TOKEN, repo.fullName);
      await prisma.repository.update({
        where: { id: repo.id },
        data: {
          language: details.language?.toLowerCase() ?? null,
          topics: details.topics ?? [],
          starsCount: details.stargazers_count,
          healthScore: computeHealthScore(details),
        },
      });
      console.log(`  ${repo.fullName} -> language=${details.language}, topics=${details.topics}`);
    } catch (err) {
      console.error(`Failed backfilling ${repo.fullName}`, err);
    }
    await sleep(1000); // this hits the core API, not search — much higher limit, lighter delay is fine
  }

  console.log("Backfill complete.");
}

run().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});