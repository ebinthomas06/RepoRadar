
"use client";

import { useState, useTransition } from "react";
import { updatePreferredTags } from "@/actions/preferences";
import { SUGGESTED_TAGS } from "@/lib/suggestedTags";

export function TagManager({
  initialTags,
}: {
  initialTags: string[];
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const suggestions = SUGGESTED_TAGS.filter(
    (tag) =>
      tag.toLowerCase().includes(normalizedQuery) &&
      !tags.includes(tag.toLowerCase())
  ).slice(0, 8);

  const canAddCustom =
    normalizedQuery.length > 0 &&
    !tags.includes(normalizedQuery) &&
    !SUGGESTED_TAGS.some(
      (tag) => tag.toLowerCase() === normalizedQuery
    );

  function persist(next: string[]) {
    const previous = tags;

    setTags(next);
    setError(null);

    startTransition(async () => {
      try {
        const result = await updatePreferredTags(next);

        if (!result?.success) {
          setTags(previous);
          setError("Couldn't save your interests.");
        }
      } catch {
        setTags(previous);
        setError("Couldn't save your interests.");
      }
    });
  }

  function addTag(raw: string) {
    const clean = raw.trim().toLowerCase();

    if (!clean || tags.includes(clean)) {
      return;
    }

    persist([...tags, clean]);
    setQuery("");
  }

  function removeTag(tag: string) {
    persist(tags.filter((current) => current !== tag));
  }

  function clearSearch() {
    setQuery("");
  }

  return (
    <div className="w-full">
      {/* Selected tags */}
      {tags.length > 0 ? (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              Selected interests
            </p>

            <span className="text-[11px] text-slate-600">
              {tags.length} {tags.length === 1 ? "topic" : "topics"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-blue-300 transition hover:border-blue-500/30 hover:bg-blue-500/15"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isPending}
                  aria-label={`Remove ${tag}`}
                  className="flex h-4 w-4 items-center justify-center rounded-md text-blue-400/60 transition hover:bg-blue-400/20 hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.72 4.72a.75.75 0 0 1 1.06 0L10 8.94l4.22-4.22a.75.75 0 1 1 1.06 1.06L11.06 10l4.22 4.22a.75.75 0 1 1-1.06 1.06L10 11.06l-4.22 4.22a.75.75 0 1 1-1.06-1.06L8.94 10 4.72 5.78a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-5 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm">
            ✦
          </div>

          <p className="text-xs font-medium text-slate-400">
            No interests selected
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            Add technologies or topics to personalize your feed.
          </p>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        {/* Search icon */}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path
            strokeLinecap="round"
            d="m13 13 4 4"
          />
        </svg>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              if (normalizedQuery) {
                addTag(normalizedQuery);
              }
            }

            if (e.key === "Escape") {
              clearSearch();
            }
          }}
          placeholder="Search or add an interest..."
          disabled={isPending}
          className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-9 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-wait disabled:opacity-60"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions */}
      {query && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              Suggestions
            </p>

            {suggestions.length > 0 && (
              <span className="text-[11px] text-slate-700">
                {suggestions.length} matches
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                disabled={isPending}
                className="group flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 disabled:opacity-50"
              >
                <span className="text-slate-600 transition group-hover:text-blue-400">
                  +
                </span>

                {suggestion}
              </button>
            ))}

            {canAddCustom && (
              <button
                type="button"
                onClick={() => addTag(normalizedQuery)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-blue-500/30 bg-blue-500/5 px-2.5 py-1.5 text-xs font-medium text-blue-400 transition hover:border-blue-500/50 hover:bg-blue-500/10 disabled:opacity-50"
              >
                <span>＋</span>
                Add &quot;{normalizedQuery}&quot;
              </button>
            )}

            {suggestions.length === 0 && !canAddCustom && (
              <p className="py-2 text-xs text-slate-600">
                No matching interests found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hint */}
      {!query && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-600">
            Press Enter to add a custom interest
          </p>

          <span className="hidden rounded border border-slate-800 px-1.5 py-0.5 text-[10px] text-slate-700 sm:inline">
            ENTER
          </span>
        </div>
      )}

      {/* Saving indicator */}
      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <span className="h-3 w-3 animate-spin rounded-full border border-slate-600 border-t-blue-400" />
          Saving interests...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <span>!</span>
          {error}
        </div>
      )}
    </div>
  );
}
