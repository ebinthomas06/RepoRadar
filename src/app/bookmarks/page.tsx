import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBookmarksForCurrentUser, type BookmarkStatus } from "@/actions/bookmarks";
import { BookmarkStatusSelect } from "@/components/BookmarkStatusSelect";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Bookmark,
  GitBranch,
  Star,
  ExternalLink,
  SearchX,
  ArrowLeft,
  CheckCircle2,
  Clock,
  GitPullRequest,
  Zap,
} from "lucide-react";
import Link from "next/link";

function getScoreStyle(score: number) {
  if (score >= 75) {
    return {
      label: "High Match",
      text: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    };
  }

  if (score >= 50) {
    return {
      label: "Good Match",
      text: "text-blue-700 dark:text-blue-400",
      bg: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20",
    };
  }

  if (score >= 30) {
    return {
      label: "Moderate",
      text: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
    };
  }

  return {
    label: "Explore",
    text: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700",
  };
}

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
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
    <DashboardLayout
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      bookmarkCount={bookmarks.length}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 hidden lg:block border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Your Workspace</p>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Saved Bookmarks
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Feed</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero Banner */}
        <section className="mb-6 sm:mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <Bookmark className="h-7 w-7 fill-white/20" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Issue Tracker
                </span>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl dark:text-white">
                  Your Saved Issues
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Keep track of interesting open-source issues, investigate contributions, and track PRs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto rounded-2xl border border-slate-200 bg-white/80 px-5 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total Saved
                </p>
                <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                  {bookmarks.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats breakdown */}
        {bookmarks.length > 0 && (
          <section className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Investigating</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {investigating}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Currently exploring codebase
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">PR in Progress</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                  <GitPullRequest className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {prOpen}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Active pull requests open
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolved</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {resolved}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Successfully merged & solved
              </p>
            </div>
          </section>
        )}

        {/* Empty state or list */}
        {bookmarks.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 shadow-sm">
              <SearchX className="h-7 w-7" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">
              No Bookmarked Issues Yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Save interesting issues from your personalized feed, and they will appear here with workflow status management.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Explore Feed Issues</span>
            </Link>
          </section>
        ) : (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Library
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Saved Issues
                </h3>
              </div>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {bookmarks.length} {bookmarks.length === 1 ? "issue" : "issues"}
              </span>
            </div>

            <div className="space-y-3.5">
              {bookmarks.map((bm) => {
                const score = Math.round(bm.issue.solvabilityScore);
                const scoreStyle = getScoreStyle(score);

                return (
                  <article
                    key={bm.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-blue-400/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900/80"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Repository */}
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                              <GitBranch className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate max-w-[220px] sm:max-w-none">
                                {bm.issue.repository.fullName}
                              </span>
                            </span>

                            <span className="text-slate-300 dark:text-slate-700">•</span>

                            <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30" />
                              {bm.issue.repository.starsCount.toLocaleString()}
                            </span>
                          </div>

                          {/* Title */}
                          <a
                            href={bm.issue.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-base sm:text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400"
                          >
                            <span>{bm.issue.title}</span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-slate-400" />
                          </a>
                        </div>

                        {/* Status Select */}
                        <div className="shrink-0">
                          <BookmarkStatusSelect
                            issueId={bm.issueId}
                            currentStatus={bm.status as BookmarkStatus}
                          />
                        </div>
                      </div>

                      {/* Labels */}
                      {bm.issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {bm.issue.labels.map((label) => (
                            <span
                              key={label}
                              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-300"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800/80">
                        <div className="flex items-center gap-3">
                          {/* Score Badge */}
                          <div
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`}
                          >
                            <Zap className="h-3 w-3" />
                            <span>{score}</span>
                            <span className="hidden sm:inline text-[11px] font-medium opacity-80">
                              {scoreStyle.label}
                            </span>
                          </div>

                          <a
                            href={bm.issue.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden items-center gap-1 text-xs text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 sm:flex"
                          >
                            <span>View on GitHub</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
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
    </DashboardLayout>
  );
}
