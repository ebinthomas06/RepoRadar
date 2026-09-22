
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 text-slate-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Login card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold shadow-xl shadow-blue-500/20">
              I
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to IssueHub
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Discover open-source issues that match your interests,
              track your progress, and find your next contribution.
            </p>
          </div>

          {/* GitHub sign in */}
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
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition-all duration-200 hover:bg-white hover:shadow-xl active:scale-[0.99]"
            >
              {/* GitHub icon */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
              </svg>

              Continue with GitHub

              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-auto h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.06-.02Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-[11px] uppercase tracking-wider text-slate-600">
              Secure authentication
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Features */}
          <div className="space-y-3">
            <Feature
              icon="✦"
              title="Personalized feed"
              description="Find issues based on your interests."
            />

            <Feature
              icon="🔖"
              title="Save issues"
              description="Keep track of issues worth contributing to."
            />

            <Feature
              icon="⚡"
              title="Smart filtering"
              description="Surface issues that match your preferences."
            />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs leading-5 text-slate-600">
            By continuing, you'll be securely authenticated through
            GitHub.
          </p>
        </div>

        {/* Brand */}
        <p className="mt-6 text-center text-xs text-slate-700">
          IssueHub · Discover. Contribute. Build.
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
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800/70 bg-slate-950/40 px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-300">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
