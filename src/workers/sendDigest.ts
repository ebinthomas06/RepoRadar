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

  for (const user of users) {
    try {
      const issues = await getDigestIssuesForUser(user.id);
      if (issues.length === 0) {
        console.log(`  ${user.username}: nothing new, skipping`);
        continue;
      }

      await sendDigestEmail(user.email, issues);

      // Log every issue we just sent, so future runs never repeat them.
      await prisma.digestLog.createMany({
        data: issues.map((issue) => ({ userId: user.id, issueId: issue.id })),
      });

      console.log(`  ${user.username}: sent ${issues.length} issue(s)`);
    } catch (err) {
      console.error(`  Failed digest for ${user.username}`, err);
    }
  }

  console.log("Digest run complete.");
}

const frequency = process.argv[2]?.toUpperCase() as Frequency | undefined;
if (frequency !== "DAILY" && frequency !== "WEEKLY") {
  console.error('Usage: tsx src/workers/sendDigest.ts <DAILY|WEEKLY>');
  process.exit(1);
}

runDigest(frequency)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });