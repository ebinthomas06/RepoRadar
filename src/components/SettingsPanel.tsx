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
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Minimum Solvability Score
              </label>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Only show issues meeting this confidence threshold.
              </p>
            </div>

            <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
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
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600 dark:bg-slate-700 dark:accent-blue-500"
          />

          <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Repository Stars */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Minimum Repository Stars
          </label>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-blue-500"
            />
          </div>
        </div>

        {/* Digest Frequency */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Email Digest Frequency
          </label>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
            className="mt-2.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
          >
            <option value="DAILY" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
              Daily (every morning)
            </option>

            <option value="WEEKLY" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
              Weekly (every Monday)
            </option>

            <option value="NEVER" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
              Never (disabled)
            </option>
          </select>
        </div>

        {/* Email alerts switch */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Email notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
            className={`relative h-6 w-11 rounded-full transition-colors ${
              settings.emailAlerts ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailAlerts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Notification message */}
        {message && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Save Button */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-50"
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