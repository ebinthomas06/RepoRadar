"use client";

import type { IssueWithRepo } from "@/actions/feed";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Star, ExternalLink, GitBranch, Zap } from "lucide-react";

function getScoreBadge(score: number) {
  const rounded = Math.round(score);
  if (rounded >= 70) {
    return {
      text: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
      label: "High Match",
    };
  }
  if (rounded >= 45) {
    return {
      text: "text-blue-700 dark:text-blue-400",
      bg: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20",
      label: "Good Match",
    };
  }
  if (rounded >= 25) {
    return {
      text: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
      label: "Moderate",
    };
  }
  return {
    text: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700",
    label: "Explore",
  };
}

export function IssueCard({ issue }: { issue: IssueWithRepo }) {
  const isBookmarked = issue.bookmarks && issue.bookmarks.length > 0;
  const score = Math.round(issue.solvabilityScore);
  const badge = getScoreBadge(score);

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4.5 transition-all duration-200 hover:border-blue-400/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-900/80 dark:hover:shadow-xl dark:hover:shadow-black/20">
      <div className="flex flex-col gap-3.5">
        {/* Top: Repo details & Bookmark action */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Repo info & Stars */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                <GitBranch className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">{issue.repository.fullName}</span>
              </span>

              <span className="text-slate-300 dark:text-slate-700">•</span>

              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30 shrink-0" />
                {issue.repository.starsCount.toLocaleString()}
              </span>
            </div>

            {/* Title with link */}
            <a
              href={issue.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400"
            >
              <span className="line-clamp-2">{issue.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-slate-400 dark:text-slate-500" />
            </a>
          </div>

          {/* Right: Score badge & Bookmark button */}
          <div className="flex shrink-0 items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${badge.bg} ${badge.text}`}
              title={`Solvability score: ${score}`}
            >
              <Zap className="h-3 w-3" />
              <span>{score}</span>
            </div>

            <BookmarkButton issueId={issue.id} initiallyBookmarked={isBookmarked} />
          </div>
        </div>

        {/* Labels */}
        {issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {issue.labels.slice(0, 6).map((label) => (
              <span
                key={label}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-300"
              >
                {label}
              </span>
            ))}
            {issue.labels.length > 6 && (
              <span className="rounded-md border border-transparent px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
                +{issue.labels.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}