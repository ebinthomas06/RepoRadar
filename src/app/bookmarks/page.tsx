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
      text: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-50/80 border-emerald-200/80 dark:bg-emerald-400/10 dark:border-emerald-400/25",
    };
  }

  if (score >= 50) {
    return {
      label: "Good Match",
      text: "text-[#8B6E50] dark:text-[#BA9879]",
      bg: "bg-[#BA9879]/15 border-[#BA9879]/30 dark:bg-[#BA9879]/15 dark:border-[#BA9879]/30",
    };
  }

  if (score >= 30) {
    return {
      label: "Moderate",
      text: "text-amber-600 dark:text-amber-300",
      bg: "bg-amber-50/80 border-amber-200/80 dark:bg-amber-400/10 dark:border-amber-400/25",
    };
  }

  return {
    label: "Explore",
    text: "text-[#707A84] dark:text-[#8B999F]",
    bg: "bg-[#E6E9E9] border-[#D8D8D8] dark:bg-[#1B1E28] dark:border-[#383F4F]",
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
      <header className="sticky top-0 z-20 hidden lg:block border-b border-[#D8D8D8] bg-[#E6E9E9]/90 backdrop-blur-xl dark:border-[#383F4F] dark:bg-[#1B1E28]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Your Workspace</p>
            <h1 className="text-lg font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">
              Saved Bookmarks
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-[#D8D8D8] bg-white px-3.5 py-2 text-xs font-semibold text-[#2E3341] shadow-xs transition hover:border-[#BA9879]/50 hover:bg-[#F0F2F2] dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2] dark:hover:border-[#BA9879]/50 dark:hover:bg-[#323949]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Feed</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero Banner */}
        <section className="mb-6 sm:mb-8 overflow-hidden rounded-3xl border border-[#D8D8D8] bg-gradient-to-br from-white via-[#E6E9E9] to-[#E6E9E9] p-6 sm:p-8 shadow-xs dark:border-[#383F4F] dark:bg-gradient-to-br dark:from-[#282E3B] dark:via-[#282E3B]/90 dark:to-[#1B1E28]">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] text-white shadow-lg shadow-[#BA9879]/25">
                <Bookmark className="h-7 w-7 fill-white/20" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6E50] dark:text-[#BA9879]">
                  Issue Tracker
                </span>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#2E3341] sm:text-2xl lg:text-3xl dark:text-[#F0F2F2]">
                  Your Saved Issues
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#707A84] dark:text-[#8B999F]">
                  Keep track of interesting open-source issues, investigate contributions, and track PRs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto rounded-2xl border border-[#D8D8D8] bg-white/90 px-5 py-3.5 shadow-xs dark:border-[#383F4F] dark:bg-[#1B1E28]/80">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#707A84] dark:text-[#8B999F]">
                  Total Saved
                </p>
                <p className="mt-0.5 text-2xl font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                  {bookmarks.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats breakdown */}
        {bookmarks.length > 0 && (
          <section className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-[#D8D8D8] bg-white p-4.5 shadow-xs dark:border-[#383F4F] dark:bg-[#282E3B]/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Investigating</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879]">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                {investigating}
              </p>
              <p className="mt-1 text-[11px] text-[#707A84] dark:text-[#8B999F]">
                Currently exploring codebase
              </p>
            </div>

            <div className="rounded-2xl border border-[#D8D8D8] bg-white p-4.5 shadow-xs dark:border-[#383F4F] dark:bg-[#282E3B]/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">PR in Progress</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879]">
                  <GitPullRequest className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                {prOpen}
              </p>
              <p className="mt-1 text-[11px] text-[#707A84] dark:text-[#8B999F]">
                Active pull requests open
              </p>
            </div>

            <div className="rounded-2xl border border-[#D8D8D8] bg-white p-4.5 shadow-xs dark:border-[#383F4F] dark:bg-[#282E3B]/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Resolved</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                {resolved}
              </p>
              <p className="mt-1 text-[11px] text-[#707A84] dark:text-[#8B999F]">
                Successfully merged & solved
              </p>
            </div>
          </section>
        )}

        {/* Empty state or list */}
        {bookmarks.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8D8D8] bg-white/60 p-8 text-center dark:border-[#383F4F] dark:bg-[#282E3B]/40">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6E9E9] text-[#707A84] dark:bg-[#1B1E28] dark:text-[#8B999F] shadow-xs">
              <SearchX className="h-7 w-7" />
            </div>

            <h2 className="text-lg font-bold text-[#2E3341] dark:text-[#F0F2F2]">
              No Bookmarked Issues Yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#707A84] dark:text-[#8B999F]">
              Save interesting issues from your personalized feed, and they will appear here with workflow status management.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#BA9879] to-[#9D7D5E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#BA9879]/20 transition hover:opacity-90 active:scale-[0.99]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Explore Feed Issues</span>
            </Link>
          </section>
        ) : (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B6E50] dark:text-[#BA9879]">
                  Library
                </p>
                <h3 className="text-xl font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                  Saved Issues
                </h3>
              </div>

              <span className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">
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
                    className="group rounded-2xl border border-[#D8D8D8] bg-white p-5 transition-all duration-200 hover:border-[#BA9879]/50 hover:shadow-md dark:border-[#383F4F] dark:bg-[#282E3B]/80 dark:hover:border-[#BA9879]/50 dark:hover:bg-[#282E3B]"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Repository */}
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-[#707A84] dark:text-[#8B999F]">
                              <GitBranch className="h-3.5 w-3.5 text-[#8B999F]" />
                              <span className="truncate max-w-[220px] sm:max-w-none">
                                {bm.issue.repository.fullName}
                              </span>
                            </span>

                            <span className="text-[#C0C6C9] dark:text-[#383F4F]">•</span>

                            <span className="flex items-center gap-1 font-medium text-[#707A84] dark:text-[#8B999F]">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30" />
                              {bm.issue.repository.starsCount.toLocaleString()}
                            </span>
                          </div>

                          {/* Title */}
                          <a
                            href={bm.issue.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-base sm:text-lg font-semibold leading-snug text-[#2E3341] transition-colors group-hover:text-[#BA9879] dark:text-[#F0F2F2] dark:group-hover:text-[#BA9879]"
                          >
                            <span>{bm.issue.title}</span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-[#8B999F]" />
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
                              className="rounded-md border border-[#D8D8D8] bg-[#F0F2F2] px-2 py-0.5 text-[11px] font-medium text-[#616B76] transition dark:border-[#383F4F] dark:bg-[#1B1E28]/70 dark:text-[#8B999F]"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D8D8D8]/60 pt-3.5 dark:border-[#383F4F]">
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
                            className="hidden items-center gap-1 text-xs text-[#707A84] transition hover:text-[#BA9879] dark:text-[#8B999F] dark:hover:text-[#BA9879] sm:flex"
                          >
                            <span>View on GitHub</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        <span className="text-[11px] text-[#8B999F]">
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
