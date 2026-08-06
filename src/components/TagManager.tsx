// src/components/TagManager.tsx
"use client";

import { useState, useTransition } from "react";
import { updatePreferredTags } from "@/actions/preferences";
import { SUGGESTED_TAGS } from "@/lib/suggestedTags";

export function TagManager({ initialTags }: { initialTags: string[] }) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const suggestions = SUGGESTED_TAGS.filter(
    (t) => t.includes(query.toLowerCase()) && !tags.includes(t)
  ).slice(0, 8);

  // Saves optimistically: updates the UI instantly, fires the server
  // action in the background. If it fails, isPending just stays stuck
  // — good enough for now, can add error handling later.
  function persist(next: string[]) {
    setTags(next);
    startTransition(() => {
      updatePreferredTags(next);
    });
  }

  function addTag(raw: string) {
    const clean = raw.trim().toLowerCase();
    if (!clean || tags.includes(clean)) return;
    persist([...tags, clean]);
    setQuery("");
  }

  function removeTag(tag: string) {
    persist(tags.filter((t) => t !== tag));
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              background: "#eee",
              borderRadius: 16,
              padding: "4px 10px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              style={{ border: "none", background: "none", cursor: "pointer" }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(query);
          }
        }}
        placeholder="Search or type a tag, then press Enter..."
        style={{ width: "100%", padding: "8px 10px", fontSize: 14 }}
      />

      {query && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => addTag(s)}
              style={{ padding: "4px 10px", fontSize: 13, cursor: "pointer" }}
            >
              + {s}
            </button>
          ))}
          {!SUGGESTED_TAGS.includes(query.trim().toLowerCase()) && (
            <button
              onClick={() => addTag(query)}
              style={{ padding: "4px 10px", fontSize: 13, cursor: "pointer" }}
            >
              + Add "{query.trim()}"
            </button>
          )}
        </div>
      )}

      {isPending && <p style={{ fontSize: 12, color: "#888" }}>Saving...</p>}
    </div>
  );
}