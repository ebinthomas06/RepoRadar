"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`flex h-9 w-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
        title="Light theme"
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-all ${
          theme === "light"
            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
        title="Dark theme"
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-all ${
          theme === "dark"
            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="System theme"
        title="System theme"
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-all ${
          theme === "system"
            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
