// src/components/BookmarkStatusSelect.tsx
"use client";

import { useTransition } from "react";
import { setBookmarkStatus, type BookmarkStatus } from "@/actions/bookmarks";

const STATUSES: BookmarkStatus[] = ["SAVED", "INVESTIGATING", "PR_OPEN", "RESOLVED"];

export function BookmarkStatusSelect({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: BookmarkStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as BookmarkStatus;
        startTransition(() => {
          setBookmarkStatus(issueId, next);
        });
      }}
      style={{ fontSize: 13, padding: "2px 6px" }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}