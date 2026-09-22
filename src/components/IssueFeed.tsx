
import type { IssueWithRepo } from "@/actions/feed";
import { IssueCard } from "@/components/IssueCard";

export function IssueFeed({ issues }: { issues: IssueWithRepo[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/70 text-xl">
          🔍
        </div>

        <h3 className="text-sm font-semibold text-slate-300">
          No matching issues
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          We couldn't find any issues matching your current interests and
          preferences. Try adding more tags or lowering your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

