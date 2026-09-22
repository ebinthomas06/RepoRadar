import { signIn } from "@/auth";
import { Radar, Sparkles, Bookmark, Zap, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50 dark:opacity-100">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/15 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/15 dark:bg-purple-600/10 blur-3xl" />
      </div>

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-xl shadow-blue-500/25">
              <Radar className="h-7 w-7 animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Welcome to RepoRadar
            </h1>

            <p className="mx-auto mt-2.5 max-w-sm text-xs sm:text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover open-source issues matched to your skills, track contributions, and supercharge your GitHub journey.
            </p>
          </div>

          {/* GitHub Sign in */}
          <form
            action={async () => {
              "use server";
              await signIn("github", {
                redirectTo: "/dashboard",
              });
            }}
            className="mt-8"
          >
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-900 bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl active:scale-[0.99] dark:border-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {/* GitHub SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
              </svg>

              <span>Continue with GitHub</span>

              <ArrowRight className="ml-auto h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Personalized Discovery
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Feature Highlights with Vector Icons */}
          <div className="space-y-2.5">
            <Feature
              icon={<Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              title="Personalized Feed"
              description="Surface open-source issues matched to your preferred topics."
            />

            <Feature
              icon={<Bookmark className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              title="Issue Tracker"
              description="Bookmark interesting problems and manage PR status."
            />

            <Feature
              icon={<Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
              title="Smart Solvability Scoring"
              description="Discover high-signal beginner to advanced issues instantly."
            />
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
            Secure authentication via GitHub OAuth. No extra passwords needed.
          </p>
        </div>

        {/* Brand footer */}
        <p className="mt-5 text-center text-xs font-medium text-slate-400 dark:text-slate-600">
          RepoRadar · Discover · Contribute · Build
        </p>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs dark:bg-slate-800">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {description}
        </p>
      </div>
    </div>
  );
}
