"use client";

import { useState } from "react";
import {
  updateUserPreferences,
  signOutUser,
} from "@/actions/preferences";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
          text: "Settings saved successfully.",
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
        text: "Failed to save settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutUser();
  };

  return (
    <div className="w-full bg-transparent text-slate-200">

      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="!flex !w-full !items-center !justify-between !rounded-xl !border !border-slate-700 !bg-slate-900 !px-4 !py-3 !text-left !text-slate-200 transition hover:!border-slate-600 hover:!bg-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm">
            ⚙
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-200">
              Settings
            </div>

            <div className="mt-0.5 text-xs text-slate-500">
              Customize your feed
            </div>
          </div>
        </div>

        <span
          className={`text-sm text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="mt-3 !rounded-2xl !border !border-slate-800 !bg-slate-900 !p-5 !text-slate-200">

          <div className="space-y-7">

            {/* Solvability */}
            <div>
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <label className="block !text-sm !font-medium !text-slate-200">
                    Minimum Solvability Score
                  </label>

                  <p className="mt-1 !text-xs !text-slate-500">
                    Only show issues above your selected threshold.
                  </p>
                </div>

                <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-sm font-bold text-blue-400">
                  {settings.minSolvability}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={settings.minSolvability}
                onChange={(e) =>
                  handleChange(
                    "minSolvability",
                    Number(e.target.value)
                  )
                }
                className="!h-2 !w-full cursor-pointer appearance-none rounded-full !bg-slate-700 accent-blue-500"
              />

              <div className="mt-2 flex justify-between !text-[11px] !text-slate-600">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Repository stars */}
            <div>
              <label className="block !text-sm !font-medium !text-slate-200">
                Minimum Repository Stars
              </label>

              <p className="mt-1 !text-xs !text-slate-500">
                Only show issues from repositories with enough activity.
              </p>

              <div className="relative mt-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                  ⭐
                </span>

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
                  className="!h-10 !w-full !rounded-lg !border !border-slate-700 !bg-slate-950 !pl-9 !pr-3 !text-sm !text-slate-200 outline-none placeholder:!text-slate-600 focus:!border-blue-500"
                />
              </div>
            </div>

            {/* Digest */}
            <div>
              <label className="block !text-sm !font-medium !text-slate-200">
                Digest Email Frequency
              </label>

              <p className="mt-1 !text-xs !text-slate-500">
                How often you receive curated issue recommendations.
              </p>

              <select
                value={settings.digestFreq}
                onChange={(e) =>
                  handleChange(
                    "digestFreq",
                    e.target.value as
                      | "DAILY"
                      | "WEEKLY"
                      | "NEVER"
                  )
                }
                className="mt-3 !h-10 !w-full !rounded-lg !border !border-slate-700 !bg-slate-950 !px-3 !text-sm !text-slate-200 outline-none focus:!border-blue-500"
              >
                <option
                  value="DAILY"
                  className="bg-slate-950 text-slate-200"
                >
                  Daily (every morning)
                </option>

                <option
                  value="WEEKLY"
                  className="bg-slate-950 text-slate-200"
                >
                  Weekly (every Monday)
                </option>

                <option
                  value="NEVER"
                  className="bg-slate-950 text-slate-200"
                >
                  Never (turn off)
                </option>
              </select>
            </div>

            {/* Email alerts */}
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div>
                <p className="!text-sm !font-medium !text-slate-200">
                  Email alerts
                </p>

                <p className="mt-1 !text-xs !text-slate-500">
                  Receive email notifications for digests and updates.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.emailAlerts}
                onClick={() =>
                  handleChange(
                    "emailAlerts",
                    !settings.emailAlerts
                  )
                }
                className={`relative !h-6 !w-11 !rounded-full !border-0 transition ${
                  settings.emailAlerts
                    ? "!bg-blue-500"
                    : "!bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.emailAlerts
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-emerald-500/20 bg-emerald-500/10 !text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 !text-red-400"
                }`}
              >
                {message.type === "success" ? "✓ " : "⚠ "}
                {message.text}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 border-t border-slate-800 pt-5">

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="!flex !flex-1 !items-center !justify-center !rounded-xl !border-0 !bg-blue-600 !px-4 !py-2.5 !text-sm !font-semibold !text-white transition hover:!bg-blue-500 disabled:!opacity-50"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="!flex !flex-1 !items-center !justify-center !rounded-xl !border !border-red-500/20 !bg-red-500/10 !px-4 !py-2.5 !text-sm !font-semibold !text-red-400 transition hover:!bg-red-500/20 disabled:!opacity-50"
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}