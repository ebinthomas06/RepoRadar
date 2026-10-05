// src/app/dashboard/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IssueFeed } from "@/components/IssueFeed";
import { getFeedForCurrentUser } from "@/actions/feed";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
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
      <header className="sticky top-0 z-20 hidden lg:block border-b border-[#D8D8D8] bg-[#E6E9E9]/90 backdrop-blur-xl dark:border-[#383F4F] dark:bg-[#1B1E28]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Personalized Discovery</p>
            <h1 className="text-lg font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">
              Developer Feed
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-xl border border-[#D8D8D8] bg-white px-3.5 py-2 text-xs font-semibold text-[#2E3341] shadow-xs transition hover:border-[#BA9879]/50 hover:bg-[#F0F2F2] dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2] dark:hover:border-[#BA9879]/50 dark:hover:bg-[#323949]"
            >
              <Sliders className="h-4 w-4 text-[#8B999F]" />
              <span>Customize Feed</span>
            </Link>

            <Link
              href="/bookmarks"
              className="flex items-center gap-2 rounded-xl border border-[#D8D8D8] bg-white px-3.5 py-2 text-xs font-semibold text-[#2E3341] shadow-xs transition hover:border-[#BA9879]/50 hover:bg-[#F0F2F2] dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2] dark:hover:border-[#BA9879]/50 dark:hover:bg-[#323949]"
            >
              <Bookmark className="h-4 w-4 text-[#BA9879]" />
              <span>Saved Bookmarks</span>
              {bookmarkCount > 0 && (
                <span className="rounded-full bg-[#BA9879]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#8B6E50] dark:bg-[#BA9879]/20 dark:text-[#BA9879]">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Hero Section */}
        <section className="mb-6 sm:mb-8 overflow-hidden rounded-3xl border border-[#D8D8D8] bg-gradient-to-br from-white via-[#E6E9E9] to-[#E6E9E9] p-6 sm:p-8 shadow-xs dark:border-[#383F4F] dark:bg-gradient-to-br dark:from-[#282E3B] dark:via-[#282E3B]/90 dark:to-[#1B1E28]">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl ring-2 ring-[#BA9879]/30 shadow-md object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] text-xl font-bold text-white shadow-lg shadow-[#BA9879]/25">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6E50] dark:text-[#BA9879]">
                    Welcome back
                  </span>
                </div>

                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#2E3341] sm:text-2xl lg:text-3xl dark:text-[#F0F2F2]">
                  {userName}
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-[#707A84] dark:text-[#8B999F]">
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto rounded-2xl border border-[#D8D8D8] bg-white/90 px-4 py-3 shadow-xs dark:border-[#383F4F] dark:bg-[#1B1E28]/80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#707A84] dark:text-[#8B999F]">
                  Feed Status
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
                    Personalized Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-[#D8D8D8] bg-white p-4.5 shadow-xs transition hover:shadow dark:border-[#383F4F] dark:bg-[#282E3B]/80">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Issues available</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879]">
                <Inbox className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#2E3341] dark:text-[#F0F2F2]">
              {issues?.length ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-[#707A84] dark:text-[#8B999F]">
              Ranked by solvability & interests
            </p>
          </div>

          <Link
            href="/settings"
            className="group rounded-2xl border border-[#D8D8D8] bg-white p-4.5 shadow-xs transition hover:border-[#BA9879]/50 hover:shadow dark:border-[#383F4F] dark:bg-[#282E3B]/80 dark:hover:border-[#BA9879]/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Selected Interests</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879]">
                <Tags className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#2E3341] group-hover:text-[#BA9879] dark:text-[#F0F2F2] dark:group-hover:text-[#BA9879] transition-colors">
              {tags.length}
            </p>
            <p className="mt-1 text-[11px] text-[#8B6E50] dark:text-[#BA9879] font-medium">
              Manage in settings →
            </p>
          </Link>

          <Link
            href="/settings"
            className="group rounded-2xl border border-[#D8D8D8] bg-white p-4.5 shadow-xs transition hover:border-[#BA9879]/50 hover:shadow dark:border-[#383F4F] dark:bg-[#282E3B]/80 dark:hover:border-[#BA9879]/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Digest Schedule</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879]">
                <Mail className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-lg sm:text-xl font-bold text-[#2E3341] group-hover:text-[#BA9879] dark:text-[#F0F2F2] dark:group-hover:text-[#BA9879] transition-colors">
              {preferences?.digestFreq === "NEVER"
                ? "Disabled"
                : preferences?.digestFreq === "WEEKLY"
                  ? "Weekly"
                  : "Daily"}
            </p>
            <p className="mt-1 text-[11px] text-[#8B6E50] dark:text-[#BA9879] font-medium">
              Configure in settings →
            </p>
          </Link>
        </section>

        {/* Focused Main Feed */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B6E50] dark:text-[#BA9879]">
                <Flame className="h-3.5 w-3.5" />
                <span>Personalized</span>
              </div>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">
                Issues for You
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-[#707A84] dark:text-[#8B999F]">
                Open-source issues matching your preferred tags and confidence score.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#D8D8D8] bg-white px-3 py-1.5 text-xs font-medium text-[#2E3341] shadow-xs hover:border-[#BA9879]/50 dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2]"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Adjust filters</span>
              </Link>

              <span className="rounded-full bg-[#E6E9E9] px-3 py-1 text-xs font-semibold text-[#2E3341] dark:bg-[#1B1E28] dark:text-[#8B999F]">
                {issues?.length ?? 0} {issues?.length === 1 ? "issue" : "issues"}
              </span>
            </div>
          </div>

          {/* Scrollable Container Card for issues */}
          <div className="rounded-3xl border border-[#D8D8D8] bg-[#E6E9E9]/40 p-3 sm:p-5 shadow-xs dark:border-[#383F4F] dark:bg-[#282E3B]/40">
            <IssueFeed issues={issues} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}