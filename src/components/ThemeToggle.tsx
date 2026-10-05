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
        className={`flex h-9 w-24 items-center justify-center rounded-xl border border-[#D8D8D8] bg-[#E6E9E9] dark:border-[#383F4F] dark:bg-[#1B1E28] ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center rounded-xl border border-[#D8D8D8] bg-[#E6E9E9] p-1 dark:border-[#383F4F] dark:bg-[#1B1E28] ${className}`}>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
        title="Light theme"
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-all ${
          theme === "light"
            ? "bg-white text-[#2E3341] shadow-xs dark:bg-[#282E3B] dark:text-[#BA9879]"
            : "text-[#707A84] hover:text-[#2E3341] dark:text-[#8B999F] dark:hover:text-[#F0F2F2]"
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
            ? "bg-white text-[#2E3341] shadow-xs dark:bg-[#282E3B] dark:text-[#BA9879]"
            : "text-[#707A84] hover:text-[#2E3341] dark:text-[#8B999F] dark:hover:text-[#F0F2F2]"
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
            ? "bg-white text-[#2E3341] shadow-xs dark:bg-[#282E3B] dark:text-[#BA9879]"
            : "text-[#707A84] hover:text-[#2E3341] dark:text-[#8B999F] dark:hover:text-[#F0F2F2]"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
