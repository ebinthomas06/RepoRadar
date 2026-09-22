"use client";

import type { IssueWithRepo } from "@/actions/feed";
import { IssueCard } from "@/components/IssueCard";
import { SearchX, Sparkles, ArrowDownUp } from "lucide-react";

export function IssueFeed({ issues }: { issues: IssueWithRepo[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 shadow-sm">
          <SearchX className="h-6 w-6" />
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-200">
          No matching issues found
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          We couldn&apos;t find any issues matching your current interests and
          preferences. Try adding more tags or adjusting your solvability score filter.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Scrollable Issues Box */}
      <div
        className="custom-scrollbar max-h-[600px] sm:max-h-[700px] overflow-y-auto space-y-3 pr-1.5 scroll-smooth"
        tabIndex={0}
        aria-label="Scrollable list of personalized issues"
      >
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      {/* Feed Bottom Status */}
      {issues.length > 5 && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Showing all {issues.length} personalized recommendations
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <ArrowDownUp className="h-3 w-3" /> Scroll inside box
          </span>
        </div>
      )}
    </div>
  );
}
