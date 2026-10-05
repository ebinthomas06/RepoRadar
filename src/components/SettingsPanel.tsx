"use client";

import { useState } from "react";
import { updateUserPreferences } from "@/actions/preferences";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  Save,
  Loader2,
  Mail,
} from "lucide-react";

interface SettingsPanelProps {
  initialSettings: {
    minSolvability: number;
    minRepoStars: number;
    digestFreq: "DAILY" | "WEEKLY" | "NEVER";
    emailAlerts: boolean;
  };
}

export function SettingsPanel({
  initialSettings,
}: SettingsPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [settings, setSettings] = useState(initialSettings);

  const handleChange = <K extends keyof typeof settings>(
    field: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateUserPreferences({
        minSolvability: settings.minSolvability,
        minRepoStars: settings.minRepoStars,
        digestFreq: settings.digestFreq,
        emailAlerts: settings.emailAlerts,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Preferences saved successfully.",
        });

        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save preferences.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Solvability */}
        <div>
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
                Minimum Solvability Score
              </label>

              <p className="mt-0.5 text-xs text-[#707A84] dark:text-[#8B999F]">
                Only show issues meeting this confidence threshold.
              </p>
            </div>

            <span className="rounded-lg border border-[#BA9879]/30 bg-[#BA9879]/15 px-2.5 py-1 text-xs font-bold text-[#8B6E50] dark:border-[#BA9879]/40 dark:bg-[#BA9879]/20 dark:text-[#BA9879]">
              {settings.minSolvability}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={settings.minSolvability}
            onChange={(e) =>
              handleChange("minSolvability", Number(e.target.value))
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D8D8D8] accent-[#BA9879] dark:bg-[#383F4F] dark:accent-[#BA9879]"
          />

          <div className="mt-1 flex justify-between text-[11px] font-medium text-[#8B999F]">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Repository Stars */}
        <div>
          <label className="block text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
            Minimum Repository Stars
          </label>

          <p className="mt-0.5 text-xs text-[#707A84] dark:text-[#8B999F]">
            Filter out repos below your star threshold.
          </p>

          <div className="relative mt-2.5">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 fill-amber-500/30" />

            <input
              type="number"
              min={0}
              value={settings.minRepoStars}
              onChange={(e) =>
                handleChange(
                  "minRepoStars",
                  Math.max(0, Number(e.target.value))
                )
              }
              className="h-10 w-full rounded-xl border border-[#D8D8D8] bg-[#F0F2F2] pl-9 pr-3 text-sm text-[#2E3341] outline-none transition placeholder:text-[#8B999F] focus:border-[#BA9879] focus:bg-white dark:border-[#383F4F] dark:bg-[#1B1E28] dark:text-[#F0F2F2] dark:placeholder:text-[#8B999F] dark:focus:border-[#BA9879]"
            />
          </div>
        </div>

        {/* Digest Frequency */}
        <div>
          <label className="block text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
            Email Digest Frequency
          </label>

          <p className="mt-0.5 text-xs text-[#707A84] dark:text-[#8B999F]">
            Schedule your periodic issue highlights.
          </p>

          <select
            value={settings.digestFreq}
            onChange={(e) =>
              handleChange(
                "digestFreq",
                e.target.value as "DAILY" | "WEEKLY" | "NEVER"
              )
            }
            className="mt-2.5 h-10 w-full rounded-xl border border-[#D8D8D8] bg-[#F0F2F2] px-3 text-sm text-[#2E3341] outline-none transition focus:border-[#BA9879] focus:bg-white dark:border-[#383F4F] dark:bg-[#1B1E28] dark:text-[#F0F2F2] dark:focus:border-[#BA9879]"
          >
            <option value="DAILY" className="bg-white text-[#2E3341] dark:bg-[#1B1E28] dark:text-[#F0F2F2]">
              Daily (every morning)
            </option>

            <option value="WEEKLY" className="bg-white text-[#2E3341] dark:bg-[#1B1E28] dark:text-[#F0F2F2]">
              Weekly (every Monday)
            </option>

            <option value="NEVER" className="bg-white text-[#2E3341] dark:bg-[#1B1E28] dark:text-[#F0F2F2]">
              Never (disabled)
            </option>
          </select>
        </div>

        {/* Email alerts switch */}
        <div className="flex items-center justify-between rounded-xl border border-[#D8D8D8] bg-[#F0F2F2] p-3.5 dark:border-[#383F4F] dark:bg-[#1B1E28]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BA9879]/15 text-[#BA9879] dark:bg-[#282E3B] dark:text-[#BA9879]">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">
                Email notifications
              </p>
              <p className="text-xs text-[#707A84] dark:text-[#8B999F]">
                Receive inbox alerts for digests.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.emailAlerts}
            onClick={() =>
              handleChange("emailAlerts", !settings.emailAlerts)
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#BA9879] focus:ring-offset-2 dark:focus:ring-offset-[#282E3B] ${
              settings.emailAlerts ? "bg-[#BA9879]" : "bg-[#D8D8D8] dark:bg-[#383F4F]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                settings.emailAlerts ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Notification message */}
        {message && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Save Button */}
        <div className="border-t border-[#D8D8D8] pt-4 dark:border-[#383F4F]">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#BA9879] to-[#9D7D5E] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#BA9879]/20 transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
