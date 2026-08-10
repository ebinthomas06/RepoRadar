// src/actions/bookmarks.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type BookmarkStatus = "SAVED" | "INVESTIGATING" | "PR_OPEN" | "RESOLVED";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

// Toggles a bookmark on/off. Returns the new state so the UI can update
// without waiting for a full page reload.
export async function toggleBookmark(issueId: string): Promise<{ bookmarked: boolean }> {
  const userId = await requireUserId();

  const existing = await prisma.userBookmark.findUnique({
    where: { userId_issueId: { userId, issueId } },
  });

  if (existing) {
    await prisma.userBookmark.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard");
    revalidatePath("/bookmarks");
    return { bookmarked: false };
  }

  await prisma.userBookmark.create({
    data: { userId, issueId, status: "SAVED" },
  });
  revalidatePath("/dashboard");
  revalidatePath("/bookmarks");
  return { bookmarked: true };
}

// Moves a bookmark through the workflow: SAVED -> INVESTIGATING -> PR_OPEN -> RESOLVED
export async function setBookmarkStatus(issueId: string, status: BookmarkStatus): Promise<void> {
  const userId = await requireUserId();

  await prisma.userBookmark.update({
    where: { userId_issueId: { userId, issueId } },
    data: { status },
  });
  revalidatePath("/bookmarks");
}

// Fetches all of the current user's bookmarks, each with the full issue
// + repository data needed to render a card.
export async function getBookmarksForCurrentUser() {
  const userId = await requireUserId();

  return prisma.userBookmark.findMany({
    where: { userId },
    include: { issue: { include: { repository: true } } },
    orderBy: { id: "desc" }, // most recently bookmarked first
  });
}