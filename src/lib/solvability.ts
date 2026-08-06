// src/lib/solvability.ts

// Tunable weights — adjust these to change how much each factor matters.
// See the comment above each for the reasoning behind its current value.
export const WEIGHTS = {
  w1: 0.5,  // freshness: newer issues score higher, decays over ~100 days
  w2: 0.3,  // repo health: healthy repos (0-100 scale) contribute up to +30
  w3: 1.5,  // active comments: each comment is a small penalty (discussion = complexity or claimed)
  w4: 15,   // open PRs: heavy penalty — a PR already in progress means it's likely not "available"
};

export interface SolvabilityInput {
  ageDays: number;
  repoHealth: number;      // 0-100
  activeComments: number;
  openPRs: number;
}

// S = max(0, min(100, w1*(100 - cappedAge) + w2*RepoHealth - w3*Comments - w4*OpenPRs))
export function computeSolvabilityScore(input: SolvabilityInput): number {
  const { ageDays, repoHealth, activeComments, openPRs } = input;
  const { w1, w2, w3, w4 } = WEIGHTS;

  // Cap age's contribution at 100 days — beyond that, age stops actively
  // punishing the score. An old-but-healthy, low-comment issue can still
  // rank well; without this cap, age alone dominates and drowns out the
  // other three factors.
  const cappedAge = Math.min(ageDays, 100);

  const raw =
    w1 * (100 - cappedAge) +
    w2 * repoHealth -
    w3 * activeComments -
    w4 * openPRs;

  return Math.round(Math.max(0, Math.min(100, raw)));
}