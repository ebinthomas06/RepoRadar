// src/components/IssueFeed.tsx
import type { IssueWithRepo } from "@/actions/feed";
import { IssueCard } from "@/components/IssueCard";

export function IssueFeed({ issues }: { issues: IssueWithRepo[] }) {
  if (issues.length === 0) {
    return (
      <p style={{ color: "#888", marginTop: 16 }}>
        No issues found matching your tags right now. Try updating your preferences!
      </p>
    );
  }

  return (
    <div style={{ marginTop: 16, width: "100%", maxWidth: 480 }}>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}