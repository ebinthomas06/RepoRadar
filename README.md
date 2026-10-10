# RepoRadar

**Discover open-source issues worth contributing to.**

RepoRadar helps developers find relevant GitHub issues based on their technology interests and issue metadata. It combines personalized discovery, solvability scoring, contribution tracking, and automated email digests.

**[Live Demo](https://reporadar.ebinthomas.dev) · [GitHub Repository](https://github.com/ebinthomas06/RepoRadar) · [Latest Release](https://github.com/ebinthomas06/RepoRadar/releases/tag/v1.0.0)**

## Features

- **GitHub OAuth:** Sign in securely using your GitHub account.
- **Personalized Discovery:** Identify technology interests from your owned and starred repositories.
- **Solvability Scoring:** Rank issues using issue age, repository health, discussion activity, and potential open pull-request collisions.
- **Contribution Tracking:** Bookmark issues and track progress through `SAVED`, `INVESTIGATING`, `PR_OPEN`, and `RESOLVED`.
- **Email Digests:** Receive relevant issue recommendations daily or weekly.
- **Automated Pipeline:** Run issue ingestion, scoring, and email delivery using GitHub Actions.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions, Node.js
- **Database & ORM:** PostgreSQL, Supabase, Prisma
- **Authentication:** Auth.js with GitHub OAuth
- **External API:** GitHub REST API
- **Automation:** GitHub Actions, `tsx`
- **Email Delivery:** Resend

## How It Works

1. Sign in with GitHub.
2. RepoRadar builds a technology interest profile from your repositories.
3. Background workers collect GitHub issues and repository metadata.
4. A heuristic scoring engine ranks issues.
5. Browse personalized recommendations and track issues using bookmarks.
6. Receive daily or weekly email digests based on your preferences.

## Getting Started

### Prerequisites

- Node.js 24
- npm
- PostgreSQL database
- GitHub OAuth application credentials
- GitHub API token
- Resend API key (for email digests)

### Installation

```bash
git clone https://github.com/ebinthomas06/RepoRadar.git
cd RepoRadar
npm install
```

Create a `.env` file and configure the environment variables required by the application. These include database connection URLs, GitHub OAuth credentials, `AUTH_TOKEN_ENCRYPTION_KEY`, `GITHUB_INGESTION_TOKEN`, and `RESEND_API_KEY`. Configure any additional variables required by your local setup.

Generate the Prisma client and apply the required database migrations using the project's Prisma configuration and commands.

Start the development server:

```bash
npm run dev
```

Use the scripts defined in `package.json` to run the background workers when their required environment variables and services are configured.

**Security:** Never commit `.env` files, API tokens, database credentials, or encryption keys.

## Project Structure

```text
src/
├── actions/       # Server actions for feeds, bookmarks, and preferences
├── app/           # Pages and authentication routes
├── components/    # UI components
├── lib/           # API clients and business logic
└── workers/       # Ingestion, scoring, and digest workers

prisma/            # Database schema and migrations
.github/workflows/ # Scheduled automation pipeline
```

## Scoring Notes

RepoRadar uses a deterministic, heuristic-based scoring system rather than a machine-learning model. Scores help prioritize potentially suitable issues but do not guarantee their difficulty or likelihood of successful completion.

## License

