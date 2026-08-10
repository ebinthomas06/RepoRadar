// src/app/bookmarks/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBookmarksForCurrentUser } from "@/actions/bookmarks";
import { BookmarkStatusSelect } from "@/components/BookmarkStatusSelect";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookmarks = await getBookmarksForCurrentUser();

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "left" }}>
      <h1 style={{ textAlign: "center" }}>Your bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
          Nothing saved yet — star an issue from your dashboard feed to see it here.
        </p>
      ) : (
        bookmarks.map((bm) => (
          <div
            key={bm.id}
            style={{
              border: "1px solid #333",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <a
                href={bm.issue.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600, textDecoration: "none" }}
              >
                {bm.issue.title}
              </a>
              <BookmarkStatusSelect issueId={bm.issueId} currentStatus={bm.status as any} />
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
              {bm.issue.repository.fullName} · ⭐ {bm.issue.repository.starsCount} · score{" "}
              {Math.round(bm.issue.solvabilityScore)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}