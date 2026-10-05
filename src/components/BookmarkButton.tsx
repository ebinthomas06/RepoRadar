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
            ? "border-[#BA9879] bg-[#BA9879]/15 text-[#8B6E50] dark:border-[#BA9879]/40 dark:bg-[#BA9879]/20 dark:text-[#BA9879]"
            : "border-[#D8D8D8] bg-[#F0F2F2] text-[#8B999F] hover:border-[#BA9879]/40 hover:bg-[#E6E9E9] hover:text-[#2E3341] dark:border-[#383F4F] dark:bg-[#1B1E28] dark:text-[#8B999F] dark:hover:border-[#BA9879]/40 dark:hover:bg-[#282E3B] dark:hover:text-[#F0F2F2]"
        }
        ${isPending ? "cursor-wait opacity-60" : "cursor-pointer"}
      `}
    >
      <Bookmark
        className={`h-4 w-4 transition-transform duration-200 ${
          bookmarked ? "fill-[#BA9879] text-[#BA9879] scale-105" : "group-hover:scale-110"
        }`}
      />

      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 dark:bg-[#1B1E28]/60 backdrop-blur-[1px]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#BA9879]" />
        </span>
      )}
    </button>
  );
}
