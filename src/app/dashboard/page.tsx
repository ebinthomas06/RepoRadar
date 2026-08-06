// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/TagManager";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welcome, {session.user.name}</h1>
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
        </div>
      </div>
    </div>
  );
}