import { signIn } from "@/auth";
import { Radar, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F0F2F2] px-5 text-[#2E3341] transition-colors duration-200 dark:bg-[#1B1E28] dark:text-[#F0F2F2]">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50 dark:opacity-100">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#BA9879]/15 dark:bg-[#BA9879]/10 blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-[#C0C6C9]/30 dark:bg-[#282E3B]/30 blur-3xl" />
        <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-[#BA9879]/10 dark:bg-[#282E3B]/20 blur-3xl" />
      </div>

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-[#D8D8D8] bg-[#E6E9E9] p-8 shadow-2xl shadow-black/10 text-[#2E3341] sm:p-10 dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2]">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] font-bold text-white shadow-xl shadow-[#BA9879]/30">
              <Radar className="h-7 w-7 animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#2E3341] sm:text-3xl dark:text-[#F0F2F2]">
              Welcome to RepoRadar
            </h1>

            <p className="mx-auto mt-2.5 max-w-sm text-xs sm:text-sm leading-6 text-[#707A84] dark:text-[#8B999F]">
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
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-[#2E3341] bg-[#2E3341] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2E3341]/20 transition-all duration-200 hover:bg-[#3E4454] hover:shadow-xl active:scale-[0.99] dark:border-[#BA9879] dark:bg-[#BA9879] dark:text-[#2E3341] dark:hover:bg-[#CDB093]"
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

          {/* Footer note */}
          <p className="mt-6 text-center text-xs leading-5 text-[#707A84] dark:text-[#8B999F]">
            Secure authentication via GitHub OAuth. No extra passwords needed.
          </p>
        </div>

        {/* Brand footer */}
        <p className="mt-5 text-center text-xs font-medium text-[#707A84] dark:text-[#8B999F]">
          RepoRadar · Discover · Contribute · Build
        </p>
      </div>
    </main>
  );
}
