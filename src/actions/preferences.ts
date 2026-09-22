// src/actions/preferences.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface UpdatePreferencesInput {
  minSolvability?: number;
  minRepoStars?: number;
  digestFreq?: "DAILY" | "WEEKLY" | "NEVER";
  emailAlerts?: boolean;
}

export async function updateUserPreferences(
  input: UpdatePreferencesInput
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Validate solvability
  if (
    input.minSolvability !== undefined &&
    (!Number.isFinite(input.minSolvability) ||
      input.minSolvability < 0 ||
      input.minSolvability > 100)
  ) {
    return {
      success: false,
      message: "Solvability must be between 0 and 100.",
    };
  }

  // Validate repository stars
  if (
    input.minRepoStars !== undefined &&
    (!Number.isFinite(input.minRepoStars) ||
      input.minRepoStars < 0)
  ) {
    return {
      success: false,
      message: "Repository stars cannot be negative.",
    };
  }

  // Validate digest frequency
  if (
    input.digestFreq !== undefined &&
    !["DAILY", "WEEKLY", "NEVER"].includes(input.digestFreq)
  ) {
    return {
      success: false,
      message: "Invalid digest frequency.",
    };
  }

  try {
    const updated = await prisma.userPreferences.update({
      where: {
        userId: session.user.id,
      },

      data: {
        ...(input.minSolvability !== undefined && {
          minSolvability: input.minSolvability,
        }),

        ...(input.minRepoStars !== undefined && {
          minRepoStars: input.minRepoStars,
        }),

        ...(input.digestFreq !== undefined && {
          digestFreq: input.digestFreq,
        }),

        ...(input.emailAlerts !== undefined && {
          emailAlerts: input.emailAlerts,
        }),
      },
    });

    return {
      success: true,
      message: "Settings updated successfully.",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating preferences:", error);

    return {
      success: false,
      message: "Failed to update settings.",
    };
  }
}

/**
 * Update the user's preferred technology/topic tags.
 */
export async function updatePreferredTags(tags: string[]) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Make sure we actually received an array.
  if (!Array.isArray(tags)) {
    return {
      success: false,
      message: "Invalid tags.",
    };
  }

  // Clean and normalize tags.
  const cleanedTags = [
    ...new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];

  // Prevent excessively long input.
  if (cleanedTags.length > 30) {
    return {
      success: false,
      message: "You can have at most 30 interests.",
    };
  }

  // Prevent excessively long individual tags.
  if (cleanedTags.some((tag) => tag.length > 50)) {
    return {
      success: false,
      message: "Each interest must be 50 characters or less.",
    };
  }

  try {
    const updated = await prisma.userPreferences.update({
      where: {
        userId: session.user.id,
      },

      data: {
        preferredTags: cleanedTags,
      },
    });

    return {
      success: true,
      message: "Interests updated successfully.",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating preferred tags:", error);

    return {
      success: false,
      message: "Failed to update interests.",
    };
  }
}

export async function signOutUser() {
  const { signOut } = await import("@/auth");

  await signOut({
    redirectTo: "/login",
  });
}