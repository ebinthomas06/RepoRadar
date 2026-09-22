
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBookmarksForCurrentUser } from "@/actions/bookmarks";
import { BookmarkStatusSelect } from "@/components/BookmarkStatusSelect";

function getScoreStyle(score: number) {
  if (score >= 75) {
    return {
      label: "High",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
  }

  if (score >= 50) {
    return {
      label: "Good",
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  }

  if (score >= 30) {
    return {
      label: "Moderate",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    };
  }

  return {
    label: "Low",
    text: "text-slate-400",
    bg: "bg-slate-800",
    border: "border-slate-700",
  };
}

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const bookmarks = await getBookmarksForCurrentUser();

  const investigating = bookmarks.filter(
    (bookmark) => bookmark.status === "INVESTIGATING"
  ).length;

  const prOpen = bookmarks.filter(
    (bookmark) => bookmark.status === "PR_OPEN"
  ).length;

  const resolved = bookmarks.filter(
    (bookmark) => bookmark.status === "RESOLVED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-5">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold shadow-lg shadow-blue-500/20">
                I
              </div>

              <div>
                <p className="font-semibold tracking-tight">IssueHub</p>

                <p className="text-xs text-slate-500">
                  Developer Feed
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <a
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <span>⌂</span>
                Dashboard
              </a>

              <a
                href="/bookmarks"
                className="flex items-center gap-3 rounded-xl bg-slate-800/80 px-3 py-2.5 text-sm font-medium text-white"
              >
                <span>🔖</span>
                Bookmarks

                {bookmarks.length > 0 && (
                  <span className="ml-auto rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    {bookmarks.length}
                  </span>
                )}
              </a>

              <a
                href="/dashboard#settings"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <span>⚙</span>
                Settings
              </a>
            </nav>

            {/* User */}
            <div className="mt-auto border-t border-slate-800 pt-4">
              <div className="flex items-center gap-3 rounded-xl p-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="h-9 w-9 rounded-full ring-2 ring-slate-700"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
                    {(session.user.name ?? "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {session.user.name ?? "Developer"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
              <div>
                <p className="text-sm text-slate-500">
                  Your library
                </p>

                <h1 className="text-lg font-semibold tracking-tight">
                  Bookmarks
                </h1>
              </div>

              <a
                href="/dashboard"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                ← Back to feed
              </a>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            {/* Hero */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
              <div className="relative p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                      🔖
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Your saved issues
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      Keep track of interesting open-source issues,
                      investigate potential contributions, and follow
                      your progress.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-5 py-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Total saved
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                      {bookmarks.length}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            {bookmarks.length > 0 && (
              <section className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Investigating
                    </p>

                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>

                  <p className="mt-2 text-3xl font-bold">
                    {investigating}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Issues you're currently exploring
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      PR open
                    </p>

                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                  </div>

                  <p className="mt-2 text-3xl font-bold">
                    {prOpen}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Contributions in progress
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Resolved
                    </p>

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <p className="mt-2 text-3xl font-bold">
                    {resolved}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Successfully completed
                  </p>
                </div>
              </section>
            )}

            {/* Empty state */}
            {bookmarks.length === 0 ? (
              <section className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                  🔖
                </div>

                <h2 className="text-lg font-semibold text-slate-200">
                  No bookmarks yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  When you find an issue worth exploring, save it from
                  your dashboard and it'll appear here.
                </p>

                <a
                  href="/dashboard"
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Explore issues
                </a>
              </section>
            ) : (
              /* Bookmark list */
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-400">
                      Saved for later
                    </p>

                    <h2 className="mt-1 text-xl font-bold tracking-tight">
                      Your issues
                    </h2>
                  </div>

                  <p className="text-xs text-slate-600">
                    {bookmarks.length}{" "}
                    {bookmarks.length === 1 ? "issue" : "issues"}
                  </p>
                </div>

                <div className="space-y-3">
                  {bookmarks.map((bm) => {
                    const score = Math.round(
                      bm.issue.solvabilityScore
                    );

                    const scoreStyle = getScoreStyle(score);

                    return (
                      <article
                        key={bm.id}
                        className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-black/10"
                      >
                        <div className="flex flex-col gap-5">
                          {/* Top */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              {/* Repository */}
                              <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-xs">
                                  ◈
                                </div>

                                <span className="truncate text-xs font-medium text-slate-500">
                                  {bm.issue.repository.fullName}
                                </span>

                                <span className="text-slate-700">
                                  •
                                </span>

                                <span className="shrink-0 text-xs text-slate-500">
                                  ⭐{" "}
                                  {bm.issue.repository.starsCount.toLocaleString()}
                                </span>
                              </div>

                              {/* Title */}
                              <a
                                href={bm.issue.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-base font-semibold leading-6 text-slate-100 transition-colors group-hover:text-blue-400 sm:text-lg"
                              >
                                {bm.issue.title}
                              </a>
                            </div>

                            {/* Status */}
                            <div className="shrink-0">
                              <BookmarkStatusSelect
                                issueId={bm.issueId}
                                currentStatus={bm.status as any}
                              />
                            </div>
                          </div>

                          {/* Labels */}
                          {bm.issue.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {bm.issue.labels.map((label) => (
                                <span
                                  key={label}
                                  className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-1 text-[11px] font-medium text-slate-400 transition group-hover:border-slate-600"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Bottom */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
                            <div className="flex items-center gap-3">
                              {/* Score */}
                              <div
                                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${scoreStyle.bg} ${scoreStyle.border}`}
                              >
                                <span
                                  className={`text-sm font-bold ${scoreStyle.text}`}
                                >
                                  {score}
                                </span>

                                <span
                                  className={`text-[11px] ${scoreStyle.text}`}
                                >
                                  {scoreStyle.label} solvability
                                </span>
                              </div>

                              {/* Open */}
                              <a
                                href={bm.issue.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-1 text-xs text-slate-500 transition hover:text-slate-300 sm:flex"
                              >
                                Open issue

                                <svg
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="h-3.5 w-3.5"
                                >
                                  <path d="M11 3a1 1 0 0 0 0 2h2.586L9.293 9.293a1 1 0 1 0 1.414 1.414L15 6.414V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-5Z" />
                                  <path d="M5 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 1 0-2-2H5Z" />
                                </svg>
                              </a>
                            </div>

                            <span className="text-xs text-slate-600">
                              Saved issue
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

