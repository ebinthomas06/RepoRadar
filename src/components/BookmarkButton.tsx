// src/components/BookmarkButton.tsx
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
    // Optimistic update: flip the UI instantly, reconcile with the
    // server in the background.
    setBookmarked((prev) => !prev);
    startTransition(() => {
      toggleBookmark(issueId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={bookmarked ? "Remove bookmark" : "Save issue"}
      style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        fontSize: 18,
        color: bookmarked ? "#f5a623" : "#888",
        padding: 0,
        lineHeight: 1,
      }}
    >
      {bookmarked ? "★" : "☆"}
    </button>
  );
}