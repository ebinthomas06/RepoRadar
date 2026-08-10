// src/actions/feed.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Issue, Repository, UserBookmark } from "@prisma/client";

export type IssueWithRepo = Issue & {
  repository: Repository;
  bookmarks: UserBookmark[]; // 0 or 1 item — this user's bookmark, if any
};

export async function getFeedForCurrentUser(): Promise<IssueWithRepo[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
    select: { preferredTags: true },
  });

  const tags = preferences?.preferredTags ?? [];
  if (tags.length === 0) return [];

  const issues = await prisma.issue.findMany({
    where: {
      isOpen: true,
      repository: {
        OR: [
          { language: { in: tags } },
          { topics: { hasSome: tags } },
        ],
      },
    },
    orderBy: { solvabilityScore: "desc" },
    include: {
      repository: true,
      bookmarks: { where: { userId: session.user.id }, take: 1 }, // NEW
    },
    take: 30,
  });

  return issues;
}