"use client";

import { useState, useTransition } from "react";
import { toggleBookmark } from "@/actions/bookmarks";

export function BookmarkButton({
  issueId,
  initiallyBookmarked,
}: {
  issueId: string;
  initiallyBookmarked: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const previous = bookmarked;

    // Optimistic UI
    setBookmarked(!previous);

    startTransition(async () => {
      try {
        await toggleBookmark(issueId);
      } catch {
        // Revert if the server action fails
        setBookmarked(previous);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={bookmarked ? "Remove bookmark" : "Save issue"}
      aria-pressed={bookmarked}
      title={bookmarked ? "Remove bookmark" : "Save issue"}
      className={`
        group relative flex h-9 w-9 items-center justify-center
        rounded-lg border transition-all duration-200
        ${
          bookmarked
            ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
            : "border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200"
        }
        ${isPending ? "cursor-wait opacity-60" : "cursor-pointer"}
      `}
    >
      <svg
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className={`
          h-[18px] w-[18px] transition-transform duration-200
          ${bookmarked ? "scale-110" : "group-hover:scale-110"}
        `}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5V21l-7-4-7 4V5.5Z"
        />
      </svg>

      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-950/30">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
        </span>
      )}
    </button>
  );
}