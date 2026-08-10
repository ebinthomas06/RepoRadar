// src/components/IssueCard.tsx
import type { IssueWithRepo } from "@/actions/feed";
import { BookmarkButton } from "@/components/BookmarkButton";

function scoreColor(score: number): string {
  if (score >= 60) return "#2e7d32";
  if (score >= 30) return "#b8860b";
  return "#888";
}

export function IssueCard({ issue }: { issue: IssueWithRepo }) {
  const isBookmarked = issue.bookmarks.length > 0;

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 10,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <a
          href={issue.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 600, textDecoration: "none" }}
        >
          {issue.title}
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 12 }}>
          <span
            style={{
              color: scoreColor(issue.solvabilityScore),
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            {Math.round(issue.solvabilityScore)}
          </span>
          <BookmarkButton issueId={issue.id} initiallyBookmarked={isBookmarked} />
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
        {issue.repository.fullName} · ⭐ {issue.repository.starsCount}
      </div>

      <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {issue.labels.map((label) => (
          <span
            key={label}
            style={{
              fontSize: 12,
              background: "#222",
              color: "#ccc",
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}