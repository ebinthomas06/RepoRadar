// src/lib/email.ts
import { Resend } from "resend";
import type { Issue, Repository } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "RepoRadar <onboarding@resend.dev>"; // swap once your domain is verified

function buildDigestHtml(issues: (Issue & { repository: Repository })[]): string {
  const rows = issues
    .map(
      (issue) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <a href="${issue.htmlUrl}" style="font-size: 15px; font-weight: 600; color: #111; text-decoration: none;">
            ${issue.title}
          </a>
          <div style="font-size: 13px; color: #777; margin-top: 4px;">
            ${issue.repository.fullName} · ⭐ ${issue.repository.starsCount} · score ${Math.round(issue.solvabilityScore)}
          </div>
        </td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #111;">Your RepoRadar digest</h2>
      <p style="color: #555; font-size: 14px;">
        Fresh issues matching your interests:
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows}
      </table>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        You're receiving this because you enabled email alerts on RepoRadar.
      </p>
    </div>
  `;
}

export async function sendDigestEmail(
  to: string,
  issues: (Issue & { repository: Repository })[]
): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `${issues.length} new issue${issues.length === 1 ? "" : "s"} matching your interests`,
    html: buildDigestHtml(issues),
  });

  if (error) {
    // Throw so the caller's try/catch actually sees this as a failure —
    // otherwise the worker logs "sent" and writes digest_logs entries
    // for emails that never left Resend.
    throw new Error(`Resend send failed: ${error.message}`);
  }
}