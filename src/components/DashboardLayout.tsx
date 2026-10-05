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
    <div className="min-h-screen bg-[#F0F2F2] text-[#2E3341] dark:bg-[#1B1E28] dark:text-[#F0F2F2] transition-colors duration-200">
      {/* Background glow decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40 dark:opacity-100">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-[#BA9879]/15 dark:bg-[#BA9879]/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#C0C6C9]/30 dark:bg-[#282E3B]/40 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#D8D8D8] bg-[#E6E9E9]/90 dark:border-[#383F4F] dark:bg-[#202531]/95 backdrop-blur-xl lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-5">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-between px-2">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] font-bold text-white shadow-lg shadow-[#BA9879]/25">
                  <Radar className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">RepoRadar</p>
                  <p className="text-xs text-[#707A84] dark:text-[#8B999F]">Developer Feed</p>
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
                        ? "bg-[#BA9879]/15 text-[#2E3341] font-semibold shadow-xs dark:bg-[#282E3B] dark:text-[#BA9879]"
                        : "text-[#616B76] hover:bg-[#D8D8D8]/50 hover:text-[#2E3341] dark:text-[#8B999F] dark:hover:bg-[#282E3B]/60 dark:hover:text-[#F0F2F2]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.active ? "text-[#BA9879]" : ""}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-auto rounded-full bg-[#BA9879]/20 px-2 py-0.5 text-[11px] font-semibold text-[#8B6E50] dark:bg-[#BA9879]/20 dark:text-[#BA9879]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Theme Switcher */}
            <div className="mt-6 border-t border-[#D8D8D8] dark:border-[#383F4F] pt-4 px-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Bottom Profile & Sign Out */}
            <div className="mt-auto border-t border-[#D8D8D8] dark:border-[#383F4F] pt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#D8D8D8]/40 dark:hover:bg-[#282E3B]/40 transition">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userName}
                    className="h-9 w-9 rounded-full ring-2 ring-[#D8D8D8] dark:ring-[#383F4F] object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] text-sm font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">{userName}</p>
                  <p className="truncate text-xs text-[#707A84] dark:text-[#8B999F]">
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
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#D8D8D8] bg-[#E6E9E9]/90 px-4 backdrop-blur-xl dark:border-[#383F4F] dark:bg-[#202531]/90 lg:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8D8D8] bg-white text-[#2E3341] transition hover:bg-[#D8D8D8]/50 dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2] dark:hover:bg-[#323949]"
                aria-label="Open sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] text-white font-bold">
                  <Radar className="h-4 w-4" />
                </div>
                <span className="font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">RepoRadar</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/bookmarks"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8D8D8] bg-white text-[#2E3341] transition hover:bg-[#D8D8D8]/50 dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2] dark:hover:bg-[#323949]"
                aria-label="Bookmarks"
              >
                <Bookmark className="h-4 w-4" />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#BA9879] px-1 text-[10px] font-bold text-white">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            </div>
          </header>

          {/* Mobile Drawer Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-[#1B1E28]/60 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Drawer Content */}
          <div
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#E6E9E9] p-5 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-[#202531] dark:border-r dark:border-[#383F4F] lg:hidden ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] font-bold text-white shadow-md">
                  <Radar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold tracking-tight text-[#2E3341] dark:text-[#F0F2F2]">RepoRadar</p>
                  <p className="text-xs text-[#707A84] dark:text-[#8B999F]">Developer Feed</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8D8D8] bg-white text-[#2E3341] transition hover:bg-[#D8D8D8]/50 dark:border-[#383F4F] dark:bg-[#282E3B] dark:text-[#F0F2F2] dark:hover:bg-[#323949]"
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
                        ? "bg-[#BA9879]/15 text-[#2E3341] font-semibold dark:bg-[#282E3B] dark:text-[#BA9879]"
                        : "text-[#616B76] hover:bg-[#D8D8D8]/50 hover:text-[#2E3341] dark:text-[#8B999F] dark:hover:bg-[#282E3B]/60 dark:hover:text-[#F0F2F2]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.active ? "text-[#BA9879]" : ""}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-auto rounded-full bg-[#BA9879]/20 px-2 py-0.5 text-[11px] font-semibold text-[#8B6E50] dark:bg-[#BA9879]/20 dark:text-[#BA9879]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Theme Toggle */}
            <div className="mt-6 border-t border-[#D8D8D8] dark:border-[#383F4F] pt-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-[#707A84] dark:text-[#8B999F]">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Profile & Sign Out footer */}
            <div className="mt-auto border-t border-[#D8D8D8] dark:border-[#383F4F] pt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl p-2 bg-white/60 dark:bg-[#282E3B]/40">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userName}
                    className="h-10 w-10 rounded-full ring-2 ring-[#D8D8D8] dark:ring-[#383F4F] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#BA9879] to-[#9D7D5E] font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#2E3341] dark:text-[#F0F2F2]">{userName}</p>
                  <p className="truncate text-xs text-[#707A84] dark:text-[#8B999F]">
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
