// src/lib/repoHealth.ts

// Produces a 0–100 score from raw GitHub repo stats. Tunable later —
// this is a first-pass heuristic, not the final formula.
export function computeHealthScore(repo: {
  stargazers_count: number;
  pushed_at: string;
}): number {
  // Stars: log scale so 10k stars doesn't totally dominate 500 stars.
  // log10(1) = 0, log10(100000) ≈ 5 → scaled to a 0-60 range.
  const starScore = Math.min(60, Math.log10(repo.stargazers_count + 1) * 12);

  // Recency: full marks if pushed within 30 days, decaying to 0 over a year.
  const daysSincePush =
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 40 - Math.max(0, daysSincePush - 30) * (40 / 335));

  return Math.round(Math.max(0, Math.min(100, starScore + recencyScore)));
}