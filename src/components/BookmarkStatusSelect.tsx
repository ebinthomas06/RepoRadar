"use client";

import { useTransition } from "react";
import {
  setBookmarkStatus,
  type BookmarkStatus,
} from "@/actions/bookmarks";
import { ChevronDown, Loader2 } from "lucide-react";

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
    <div className="relative inline-flex items-center">
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
          h-8.5 appearance-none rounded-xl border
          border-[#D8D8D8] bg-white
          pl-3 pr-7.5 text-xs font-medium
          text-[#2E3341] outline-none
          transition
          hover:border-[#BA9879]/60
          focus:border-[#BA9879]
          focus:ring-2 focus:ring-[#BA9879]/15
          dark:border-[#383F4F] dark:bg-[#1B1E28] dark:text-[#F0F2F2]
          dark:hover:border-[#BA9879]/60
          disabled:cursor-wait disabled:opacity-50
        `}
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value} className="bg-white text-[#2E3341] dark:bg-[#1B1E28] dark:text-[#F0F2F2]">
            {status.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8B999F]" />

      {isPending && (
        <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2">
          <Loader2 className="h-3 w-3 animate-spin text-[#BA9879]" />
        </span>
      )}

      {/* Screen-reader description */}
      <span className="sr-only">
        {current?.description}
      </span>
    </div>
  );
}
