import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/TagManager";
import { SettingsPanel } from "@/components/SettingsPanel";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Sliders, Tags, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [preferences, bookmarkCount] = await Promise.all([
    prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    }),
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
      {/* Top Header */}
      <header className="sticky top-0 z-20 hidden lg:block border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Account & Feed</p>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Settings & Preferences
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

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6 sm:space-y-8">
        {/* Profile Card Header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl ring-2 ring-blue-500/20 shadow-md object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Your Profile
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

            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Connected Provider
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                GitHub OAuth
              </p>
            </div>
          </div>
        </section>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Interests Section */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Your Interests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Customize the technologies and topics used to curate your feed.
                </p>
              </div>
            </div>

            <TagManager initialTags={tags} />
          </section>

          {/* Feed Preferences Section */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-sm">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Feed Preferences
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fine-tune solvability thresholds and email notification frequencies.
                </p>
              </div>
            </div>

            <SettingsPanel
              initialSettings={{
                minSolvability: preferences?.minSolvability ?? 30,
                minRepoStars: preferences?.minRepoStars ?? 0,
                digestFreq:
                  (preferences?.digestFreq as
                    | "DAILY"
                    | "WEEKLY"
                    | "NEVER") ?? "DAILY",
                emailAlerts: preferences?.emailAlerts ?? true,
              }}
            />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
