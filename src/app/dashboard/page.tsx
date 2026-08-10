// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/TagManager";
import { IssueFeed } from "@/components/IssueFeed";
import { getFeedForCurrentUser } from "@/actions/feed";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [preferences, issues] = await Promise.all([
    prisma.userPreferences.findUnique({ where: { userId: session.user.id } }),
    getFeedForCurrentUser(),
  ]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welcome, {session.user.name}</h1>
      <p>{session.user.email}</p>
      <p style={{ marginTop: 8 }}>
        <a href="/bookmarks" style={{ fontSize: 14 }}>
          View your bookmarks →
        </a>
      </p>
      <img
        src={session.user.image ?? ""}
        alt="avatar"
        style={{ borderRadius: "50%", width: 80 }}
      />
      <p>{session.user.email}</p>

      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
        <div>
          <h3>Your interests</h3>
          <TagManager initialTags={preferences?.preferredTags ?? []} />

          <h3 style={{ marginTop: "2rem" }}>Issues for you</h3>
          <IssueFeed issues={issues} />
        </div>
      </div>
    </div>
  );
}