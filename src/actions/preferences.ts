// src/actions/preferences.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePreferredTags(tags: string[]): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Clean input: lowercase, trim, drop empties/duplicates, cap at 20
  // so someone can't spam the array with hundreds of tags.
  const cleaned = Array.from(
    new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))
  ).slice(0, 20);

  await prisma.userPreferences.update({
    where: { userId: session.user.id },
    data: { preferredTags: cleaned },
  });

  // Tells Next.js the dashboard page's cached data is stale, so it
  // re-fetches fresh data next time it's visited.
  revalidatePath("/dashboard");
}