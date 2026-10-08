// src/workers/sendDigest.ts

import "dotenv/config";

import { prisma } from "@/lib/prisma";
import { getDigestIssuesForUser } from "@/lib/digest";
import { sendDigestEmail } from "@/lib/email";

type Frequency = "DAILY" | "WEEKLY";

async function runDigest(frequency: Frequency) {
  const users = await prisma.user.findMany({
    where: {
      preferences: {
        emailAlerts: true,
        digestFreq: frequency,
      },
    },
    include: { preferences: true },
  });

  console.log(`Found ${users.length} users for ${frequency} digest`);

  let sentCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const user of users) {
    try {
      const issues = await getDigestIssuesForUser(user.id);

      if (issues.length === 0) {
        console.log(`  ${user.username}: nothing new, skipping`);
        skippedCount++;
        continue;
      }

      await sendDigestEmail(user.email, issues);

      // Only log issues AFTER the email was successfully sent.
      // This prevents failed emails from being marked as delivered.
      await prisma.digestLog.createMany({
        data: issues.map((issue) => ({
          userId: user.id,
          issueId: issue.id,
        })),
      });

      sentCount++;

      console.log(
        `  ${user.username}: sent ${issues.length} issue(s)`
      );
    } catch (err) {
      failedCount++;

      console.error(
        `  Failed digest for ${user.username}`,
        err
      );
    }
  }

  console.log("");
  console.log("Digest run complete.");
  console.log(`  Users found: ${users.length}`);
  console.log(`  Emails sent: ${sentCount}`);
  console.log(`  Users skipped: ${skippedCount}`);
  console.log(`  Emails failed: ${failedCount}`);

  // IMPORTANT:
  // If even one email failed, make the process exit with failure.
  // This causes GitHub Actions to correctly mark the job as failed.
  if (failedCount > 0) {
    throw new Error(
      `${failedCount} digest email(s) failed to send`
    );
  }
}

const frequency = process.argv[2]?.toUpperCase() as
  | Frequency
  | undefined;

if (frequency !== "DAILY" && frequency !== "WEEKLY") {
  console.error(
    "Usage: tsx src/workers/sendDigest.ts <DAILY|WEEKLY>"
  );

  process.exit(1);
}

runDigest(frequency)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Digest worker failed:", err);
    process.exit(1);
  });