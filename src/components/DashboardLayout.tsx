"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bookmark,
  Sliders,
  Menu,
  X,
  Radar,
  LogOut,
  Loader2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOutUser } from "@/actions/preferences";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  bookmarkCount?: number;
}

export function DashboardLayout({
  children,
  user,
  bookmarkCount = 0,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  const userName = user.name || "Developer";
  const userEmail = user.email || "";
  const avatar = user.image;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutUser();
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: Bookmark,
      active: pathname === "/bookmarks",
      badge: bookmarkCount > 0 ? bookmarkCount : null,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Sliders,
      active: pathname === "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Background glow decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40 dark:opacity-100">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-xl lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-5">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-between px-2">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/20">
                  <Radar className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold tracking-tight text-slate-900 dark:text-white">RepoRadar</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Developer Feed</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      item.active
                        ? "bg-blue-50 text-blue-600 shadow-sm dark:bg-slate-800/90 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Theme Switcher */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800/80 pt-4 px-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Bottom Profile & Sign Out */}
            <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userName}
                    className="h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 disabled:opacity-50"
              >
                {isSigningOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header Bar & Slide-out Drawer */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile Top Navigation */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Open sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
                  <Radar className="h-4 w-4" />
                </div>
                <span className="font-bold tracking-tight text-slate-900 dark:text-white">RepoRadar</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/bookmarks"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Bookmarks"
              >
                <Bookmark className="h-4 w-4" />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            </div>
          </header>

          {/* Mobile Drawer Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Drawer Content */}
          <div
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-950 dark:border-r dark:border-slate-800 lg:hidden ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-md">
                  <Radar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold tracking-tight text-slate-900 dark:text-white">RepoRadar</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Developer Feed</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Nav items */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                      item.active
                        ? "bg-blue-50 text-blue-600 dark:bg-slate-800/90 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.active ? "text-blue-600 dark:text-blue-400" : ""}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Theme Toggle */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Profile & Sign Out footer */}
            <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl p-2 bg-slate-50 dark:bg-slate-900/50">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userName}
                    className="h-10 w-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* Mobile Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 disabled:opacity-50"
              >
                {isSigningOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>

          {/* Main Page Area */}
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
