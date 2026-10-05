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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#707A84] dark:text-[#8B999F]">
              Selected interests
            </p>

            <span className="text-[11px] font-medium text-[#707A84] dark:text-[#8B999F]">
              {tags.length} {tags.length === 1 ? "topic" : "topics"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group flex items-center gap-1.5 rounded-lg border border-[#BA9879]/30 bg-[#BA9879]/15 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[#8B6E50] transition hover:border-[#BA9879]/50 hover:bg-[#BA9879]/25 dark:border-[#BA9879]/40 dark:bg-[#BA9879]/20 dark:text-[#BA9879] dark:hover:border-[#BA9879]/60 dark:hover:bg-[#BA9879]/30"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isPending}
                  aria-label={`Remove ${tag}`}
                  className="flex h-4 w-4 items-center justify-center rounded-md text-[#8B6E50]/80 transition hover:bg-[#BA9879]/30 hover:text-[#2E3341] dark:text-[#BA9879]/80 dark:hover:bg-[#BA9879]/40 dark:hover:text-[#F0F2F2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-dashed border-[#D8D8D8] bg-[#F0F2F2]/50 px-4 py-5 text-center dark:border-[#383F4F] dark:bg-[#282E3B]/30">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#BA9879] shadow-xs dark:bg-[#1B1E28] dark:text-[#BA9879]">
            <Sparkles className="h-4 w-4" />
          </div>

          <p className="text-xs font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
            No interests selected
          </p>

          <p className="mt-1 text-[11px] text-[#707A84] dark:text-[#8B999F]">
            Add technologies or topics to personalize your feed.
          </p>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B999F]" />

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
          className="h-10.5 w-full rounded-xl border border-[#D8D8D8] bg-white pl-9 pr-9 text-sm text-[#2E3341] outline-none transition placeholder:text-[#8B999F] hover:border-[#BA9879]/50 focus:border-[#BA9879] focus:ring-2 focus:ring-[#BA9879]/15 dark:border-[#383F4F] dark:bg-[#1B1E28] dark:text-[#F0F2F2] dark:placeholder:text-[#8B999F] dark:hover:border-[#BA9879]/50 disabled:cursor-wait disabled:opacity-60"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-[#8B999F] transition hover:bg-[#E6E9E9] hover:text-[#2E3341] dark:text-[#8B999F] dark:hover:bg-[#282E3B] dark:hover:text-[#F0F2F2]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {query && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#707A84] dark:text-[#8B999F]">
              Suggestions
            </p>

            {suggestions.length > 0 && (
              <span className="text-[11px] text-[#8B999F]">
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
                className="group flex items-center gap-1.5 rounded-lg border border-[#D8D8D8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2E3341] transition hover:border-[#BA9879] hover:bg-[#BA9879]/10 hover:text-[#8B6E50] dark:border-[#383F4F] dark:bg-[#1B1E28] dark:text-[#8B999F] dark:hover:border-[#BA9879]/40 dark:hover:bg-[#BA9879]/15 dark:hover:text-[#BA9879] disabled:opacity-50"
              >
                <Plus className="h-3 w-3 text-[#8B999F] transition group-hover:text-[#BA9879]" />
                {suggestion}
              </button>
            ))}

            {canAddCustom && (
              <button
                type="button"
                onClick={() => addTag(normalizedQuery)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#BA9879] bg-[#BA9879]/10 px-2.5 py-1.5 text-xs font-medium text-[#8B6E50] transition hover:bg-[#BA9879]/20 dark:border-[#BA9879]/50 dark:bg-[#BA9879]/10 dark:text-[#BA9879] dark:hover:bg-[#BA9879]/20 disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                Add &quot;{normalizedQuery}&quot;
              </button>
            )}

            {suggestions.length === 0 && !canAddCustom && (
              <p className="py-2 text-xs text-[#707A84] dark:text-[#8B999F]">
                No matching interests found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hint */}
      {!query && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#707A84] dark:text-[#8B999F]">
          <p>Press Enter to add custom interest</p>
          <span className="hidden rounded border border-[#D8D8D8] px-1.5 py-0.5 text-[10px] text-[#707A84] dark:border-[#383F4F] dark:text-[#8B999F] sm:inline">
            ENTER
          </span>
        </div>
      )}

      {/* Saving indicator */}
      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-[#707A84] dark:text-[#8B999F]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#BA9879]" />
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
