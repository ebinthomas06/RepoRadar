"use client";

import type { IssueWithRepo } from "@/actions/feed";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Star, ExternalLink, GitBranch, Zap } from "lucide-react";

function getScoreBadge(score: number) {
  const rounded = Math.round(score);
  if (rounded >= 70) {
    return {
      text: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-50/80 border-emerald-200/80 dark:bg-emerald-400/10 dark:border-emerald-400/25",
      label: "High Match",
    };
  }
  if (rounded >= 45) {
    return {
      text: "text-[#8B6E50] dark:text-[#BA9879]",
      bg: "bg-[#BA9879]/15 border-[#BA9879]/30 dark:bg-[#BA9879]/15 dark:border-[#BA9879]/30",
      label: "Good Match",
    };
  }
  if (rounded >= 25) {
    return {
      text: "text-amber-600 dark:text-amber-300",
      bg: "bg-amber-50/80 border-amber-200/80 dark:bg-amber-400/10 dark:border-amber-400/25",
      label: "Moderate",
    };
  }
  return {
    text: "text-[#707A84] dark:text-[#8B999F]",
    bg: "bg-[#E6E9E9] border-[#D8D8D8] dark:bg-[#1B1E28] dark:border-[#383F4F]",
    label: "Explore",
  };
}

export function IssueCard({ issue }: { issue: IssueWithRepo }) {
  const isBookmarked = issue.bookmarks && issue.bookmarks.length > 0;
  const score = Math.round(issue.solvabilityScore);
  const badge = getScoreBadge(score);

  return (
    <article className="group rounded-2xl border border-[#D8D8D8] bg-white p-4.5 transition-all duration-200 hover:border-[#BA9879]/50 hover:shadow-md dark:border-[#383F4F] dark:bg-[#282E3B]/90 dark:hover:border-[#BA9879]/50 dark:hover:bg-[#282E3B] dark:hover:shadow-xl dark:hover:shadow-black/20">
      <div className="flex flex-col gap-3.5">
        {/* Top: Repo details & Bookmark action */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Repo info & Stars */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-[#707A84] dark:text-[#8B999F]">
                <GitBranch className="h-3.5 w-3.5 text-[#8B999F] shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">{issue.repository.fullName}</span>
              </span>

              <span className="text-[#C0C6C9] dark:text-[#383F4F]">•</span>

              <span className="flex items-center gap-1 text-[#707A84] dark:text-[#8B999F] font-medium">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30 shrink-0" />
                {issue.repository.starsCount.toLocaleString()}
              </span>
            </div>

            {/* Title with link */}
            <a
              href={issue.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold leading-snug text-[#2E3341] transition-colors group-hover:text-[#BA9879] dark:text-[#F0F2F2] dark:group-hover:text-[#BA9879]"
            >
              <span className="line-clamp-2">{issue.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-[#8B999F]" />
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
                className="rounded-md border border-[#D8D8D8] bg-[#F0F2F2] px-2 py-0.5 text-[11px] font-medium text-[#616B76] transition dark:border-[#383F4F] dark:bg-[#1B1E28]/70 dark:text-[#8B999F]"
              >
                {label}
              </span>
            ))}
            {issue.labels.length > 6 && (
              <span className="rounded-md border border-transparent px-1.5 py-0.5 text-[11px] font-medium text-[#8B999F]">
                +{issue.labels.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
