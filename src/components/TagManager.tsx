"use client";

import { useState, useTransition } from "react";
import { updatePreferredTags } from "@/actions/preferences";
import { SUGGESTED_TAGS } from "@/lib/suggestedTags";
import { Sparkles, Search, Plus, X, AlertCircle, Loader2 } from "lucide-react";

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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Selected interests
            </p>

            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {tags.length} {tags.length === 1 ? "topic" : "topics"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/15"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isPending}
                  aria-label={`Remove ${tag}`}
                  className="flex h-4 w-4 items-center justify-center rounded-md text-blue-500/80 transition hover:bg-blue-200/50 hover:text-blue-800 dark:text-blue-400/70 dark:hover:bg-blue-400/20 dark:hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>

          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No interests selected
          </p>

          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Add technologies or topics to personalize your feed.
          </p>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

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
          className="h-10.5 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-600 dark:hover:border-slate-600 disabled:cursor-wait disabled:opacity-60"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {query && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Suggestions
            </p>

            {suggestions.length > 0 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
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
                className="group flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 disabled:opacity-50"
              >
                <Plus className="h-3 w-3 text-slate-400 transition group-hover:text-blue-500" />
                {suggestion}
              </button>
            ))}

            {canAddCustom && (
              <button
                type="button"
                onClick={() => addTag(normalizedQuery)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-blue-400 bg-blue-50/50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/5 dark:text-blue-400 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                Add &quot;{normalizedQuery}&quot;
              </button>
            )}

            {suggestions.length === 0 && !canAddCustom && (
              <p className="py-2 text-xs text-slate-500 dark:text-slate-500">
                No matching interests found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hint */}
      {!query && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <p>Press Enter to add custom interest</p>
          <span className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:inline">
            ENTER
          </span>
        </div>
      )}

      {/* Saving indicator */}
      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
          Saving interests...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
