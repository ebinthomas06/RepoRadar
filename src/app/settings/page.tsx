import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/TagManager";
import { SettingsPanel } from "@/components/SettingsPanel";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Sliders, Tags, ArrowLeft } from "lucide-react";
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
      <header className="sticky top-0 z-20 hidden lg:block border-b border-[#D8D8D8] bg-[#E6E9E9]/90 backdrop-blur-xl dark:border-[#383F4F] dark:bg-[#1B1E28]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div>
            <p className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Account & Feed</p>
            <h1 className="text-lg font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">
              Settings & Preferences
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

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6 sm:space-y-8">
        {/* Profile Card Header */}
        <section className="overflow-hidden rounded-3xl border border-[#D8D8D8] bg-gradient-to-br from-white via-[#E6E9E9] to-[#E6E9E9] p-6 sm:p-8 shadow-xs dark:border-[#383F4F] dark:bg-gradient-to-br dark:from-[#282E3B] dark:via-[#282E3B]/90 dark:to-[#1B1E28]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl ring-2 ring-[#BA9879]/30 shadow-md object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] text-2xl font-bold text-white shadow-lg shadow-[#BA9879]/25">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6E50] dark:text-[#BA9879]">
                    Your Profile
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

            <div className="rounded-2xl border border-[#D8D8D8] bg-white/90 px-4 py-3 shadow-xs dark:border-[#383F4F] dark:bg-[#1B1E28]/80">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#707A84] dark:text-[#8B999F]">
                Connected Provider
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
                GitHub OAuth
              </p>
            </div>
          </div>
        </section>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Interests Section */}
          <section className="rounded-3xl border border-[#D8D8D8] bg-white p-6 shadow-xs dark:border-[#383F4F] dark:bg-[#282E3B]/80">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879] shadow-xs">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                  Your Interests
                </h3>
                <p className="text-xs text-[#707A84] dark:text-[#8B999F]">
                  Customize the technologies and topics used to curate your feed.
                </p>
              </div>
            </div>

            <TagManager initialTags={tags} />
          </section>

          {/* Feed Preferences Section */}
          <section className="rounded-3xl border border-[#D8D8D8] bg-white p-6 shadow-xs dark:border-[#383F4F] dark:bg-[#282E3B]/80">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#1B1E28] dark:text-[#BA9879] shadow-xs">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2E3341] dark:text-[#F0F2F2]">
                  Feed Preferences
                </h3>
                <p className="text-xs text-[#707A84] dark:text-[#8B999F]">
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
