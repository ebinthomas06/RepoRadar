"use client";

import { useTransition } from "react";
import {
  setBookmarkStatus,
  type BookmarkStatus,
} from "@/actions/bookmarks";

const STATUSES: {
  value: BookmarkStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "SAVED",
    label: "Saved",
    description: "Want to look at this later",
  },
  {
    value: "INVESTIGATING",
    label: "Investigating",
    description: "Currently looking into it",
  },
  {
    value: "PR_OPEN",
    label: "PR Open",
    description: "A pull request is open",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
    description: "Issue has been resolved",
  },
];

export function BookmarkStatusSelect({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: BookmarkStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const current = STATUSES.find(
    (status) => status.value === currentStatus
  );

  return (
    <div className="relative inline-flex">
      <select
        value={currentStatus}
        disabled={isPending}
        aria-label="Bookmark status"
        onChange={(e) => {
          const next = e.target.value as BookmarkStatus;

          startTransition(async () => {
            await setBookmarkStatus(issueId, next);
          });
        }}
        className={`
          h-9 appearance-none rounded-lg border
          border-slate-700 bg-slate-900
          pl-3 pr-8 text-xs font-medium
          text-slate-300 outline-none
          transition
          hover:border-slate-600
          focus:border-blue-500/50
          focus:ring-2 focus:ring-blue-500/10
          disabled:cursor-wait disabled:opacity-50
        `}
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>

      {isPending && (
        <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2">
          <span className="block h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
        </span>
      )}

      {/* Screen-reader description */}
      <span className="sr-only">
        {current?.description}
      </span>
    </div>
  );
}