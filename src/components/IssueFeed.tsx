"use client";

import type { IssueWithRepo } from "@/actions/feed";
import { IssueCard } from "@/components/IssueCard";
import { SearchX, Sparkles, ArrowDownUp } from "lucide-react";

export function IssueFeed({ issues }: { issues: IssueWithRepo[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8D8D8] bg-white/60 p-8 text-center dark:border-[#383F4F] dark:bg-[#282E3B]/30">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6E9E9] text-[#707A84] dark:bg-[#1B1E28] dark:text-[#8B999F] shadow-sm">
          <SearchX className="h-6 w-6" />
        </div>

        <h3 className="text-base font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
          No matching issues found
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#707A84] dark:text-[#8B999F]">
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
        <div className="mt-3 flex items-center justify-between border-t border-[#D8D8D8] pt-3 text-xs text-[#707A84] dark:border-[#383F4F] dark:text-[#8B999F]">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[#BA9879]" />
            Showing all {issues.length} personalized recommendations
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#8B999F] dark:text-[#8B999F]">
            <ArrowDownUp className="h-3 w-3" /> Scroll inside box
          </span>
        </div>
      )}
    </div>
  );
}
