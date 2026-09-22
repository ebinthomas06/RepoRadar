"use client";

import { useState, useTransition } from "react";
import { toggleBookmark } from "@/actions/bookmarks";
import { Bookmark, Loader2 } from "lucide-react";

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
        group relative flex h-8.5 w-8.5 items-center justify-center
        rounded-xl border transition-all duration-200
        ${
          bookmarked
            ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
            : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        }
        ${isPending ? "cursor-wait opacity-60" : "cursor-pointer"}
      `}
    >
      <Bookmark
        className={`h-4 w-4 transition-transform duration-200 ${
          bookmarked ? "fill-amber-500 text-amber-500 scale-105" : "group-hover:scale-110"
        }`}
      />

      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-[1px]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
        </span>
      )}
    </button>
  );
}