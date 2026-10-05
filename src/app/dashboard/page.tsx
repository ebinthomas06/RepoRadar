// src/app/dashboard/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IssueFeed } from "@/components/IssueFeed";
import { getFeedForCurrentUser } from "@/actions/feed";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Sparkles,
  CheckCircle2,
  Inbox,
  Tags,
  Mail,
  Flame,
  Bookmark,
  Sliders,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [preferences, issues, bookmarkCount] = await Promise.all([
    prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    }),
    getFeedForCurrentUser(),
    prisma.userBookmark.count({
      where: { userId: session.user.id },
    }),
  ]);

  const userName = session.user.name || "Developer";
  const userEmail = session.user.email || "";
  const avatar = session.user.image;

  const tags = preferences?.preferredTags ?? [];

  return (
    <DashboardLayout
      user={{
        name: userName,
        email: userEmail,
        image: avatar,
      }}
      bookmarkCount={bookmarkCount}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-20 hidden lg:block border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Personalized Discovery</p>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Developer Feed
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Sliders className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>Customize Feed</span>
            </Link>

            <Link
              href="/bookmarks"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Saved Bookmarks</span>
              {bookmarkCount > 0 && (
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Hero Section */}
        <section className="mb-6 sm:mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl ring-2 ring-blue-500/20 shadow-md object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Welcome back
                  </span>
                </div>

                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl dark:text-white">
                  {userName}
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Feed Status
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Personalized Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition hover:shadow dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Issues available</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Inbox className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {issues?.length ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Ranked by solvability & interests
            </p>
          </div>

          <Link
            href="/settings"
            className="group rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition hover:border-blue-400/50 hover:shadow dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Selected Interests</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Tags className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
              {tags.length}
            </p>
            <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Manage in settings →
            </p>
          </Link>

          <Link
            href="/settings"
            className="group rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition hover:border-blue-400/50 hover:shadow dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Digest Schedule</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Mail className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
              {preferences?.digestFreq === "NEVER"
                ? "Disabled"
                : preferences?.digestFreq === "WEEKLY"
                  ? "Weekly"
                  : "Daily"}
            </p>
            <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Configure in settings →
            </p>
          </Link>
        </section>

        {/* Focused Main Feed */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Flame className="h-3.5 w-3.5" />
                <span>Personalized</span>
              </div>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Issues for You
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Open-source issues matching your preferred tags and confidence score.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Adjust filters</span>
              </Link>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {issues?.length ?? 0} {issues?.length === 1 ? "issue" : "issues"}
              </span>
            </div>
          </div>

          {/* Scrollable Container Card for issues */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <IssueFeed issues={issues} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}