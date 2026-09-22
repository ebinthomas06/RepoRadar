// src/app/dashboard/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/TagManager";
import { IssueFeed } from "@/components/IssueFeed";
import { SettingsPanel } from "@/components/SettingsPanel";
import { getFeedForCurrentUser } from "@/actions/feed";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [preferences, issues] = await Promise.all([
    prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    }),
    getFeedForCurrentUser(),
  ]);

  const userName = session.user.name || "Developer";
  const userEmail = session.user.email || "";
  const avatar = session.user.image;

  const tags = preferences?.preferredTags ?? [];

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
                <p className="text-xs text-slate-500">Developer Feed</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <a
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-slate-800/80 px-3 py-2.5 text-sm font-medium text-white"
              >
                <span>⌂</span>
                Dashboard
              </a>

              <a
                href="/bookmarks"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <span>🔖</span>
                Bookmarks
              </a>

              <a
                href="#settings"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <span>⚙</span>
                Settings
              </a>
            </nav>

            {/* Bottom profile */}
            <div className="mt-auto border-t border-slate-800 pt-4">
              <div className="flex items-center gap-3 rounded-xl p-2">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userName}
                    className="h-9 w-9 rounded-full ring-2 ring-slate-700"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{userName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
              <div>
                <p className="text-sm text-slate-500">Dashboard</p>
                <h1 className="text-lg font-semibold tracking-tight">
                  Your developer feed
                </h1>
              </div>

              <a
                href="/bookmarks"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                🔖 Bookmarks
              </a>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            {/* Welcome section */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
              <div className="relative p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={userName}
                        className="h-16 w-16 rounded-2xl ring-1 ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-sm text-slate-400">
                        Welcome back 👋
                      </p>

                      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {userName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Feed status
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                      <span className="text-sm font-medium text-slate-200">
                        Personalized
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-500">Issues available</p>
                <p className="mt-2 text-3xl font-bold">
                  {issues?.length ?? 0}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Based on your current feed
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-500">Interests</p>
                <p className="mt-2 text-3xl font-bold">{tags.length}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Technologies & topics
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-500">Digest</p>
                <p className="mt-2 text-xl font-bold">
                  {preferences?.digestFreq === "NEVER"
                    ? "Off"
                    : preferences?.digestFreq === "WEEKLY"
                      ? "Weekly"
                      : "Daily"}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Email notifications
                </p>
              </div>
            </section>

            {/* Content grid */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              {/* Main feed */}
              <section className="min-w-0">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-400">
                      Personalized
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                      Issues for you
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Open-source issues matching your interests and preferences.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 sm:p-5">
                  <IssueFeed issues={issues} />
                </div>
              </section>

              {/* Right sidebar */}
              <aside className="space-y-6">
                {/* Interests */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="mb-4">
                    <h2 className="font-semibold">Your interests</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Customize the topics used to personalize your feed.
                    </p>
                  </div>

                  <TagManager initialTags={tags} />
                </section>

                {/* Settings */}
                <section
                  id="settings"
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <div className="mb-4">
                    <h2 className="font-semibold">Feed settings</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Fine-tune the issues you want to discover.
                    </p>
                  </div>

                  <SettingsPanel
                    initialSettings={{
                      minSolvability:
                        preferences?.minSolvability ?? 30,
                      minRepoStars:
                        preferences?.minRepoStars ?? 0,
                      digestFreq:
                        (preferences?.digestFreq as
                          | "DAILY"
                          | "WEEKLY"
                          | "NEVER") ?? "DAILY",
                      emailAlerts:
                        preferences?.emailAlerts ?? true,
                    }}
                  />
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}