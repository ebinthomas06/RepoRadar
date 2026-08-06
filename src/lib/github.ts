// src/lib/github.ts

export interface GithubRepoSummary {
  language: string | null;
  topics: string[];
  fork: boolean;
}

const GITHUB_API = "https://api.github.com";

async function githubFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${path} failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// Repos the user owns — affiliation=owner excludes repos they're just a
// collaborator on, which would muddy the "this is genuinely their work" signal.
export async function fetchOwnedRepos(token: string): Promise<GithubRepoSummary[]> {
  return githubFetch<GithubRepoSummary[]>(
    "/user/repos?per_page=100&sort=updated&affiliation=owner",
    token
  );
}

// Repos the user has starred — a weaker but still meaningful interest signal.
export async function fetchStarredRepos(token: string): Promise<GithubRepoSummary[]> {
  return githubFetch<GithubRepoSummary[]>("/user/starred?per_page=100", token);
}


export interface GithubIssueSearchItem {
  number: number;
  title: string;
  html_url: string;
  comments: number;
  created_at: string;
  labels: { name: string }[];
  repository_url: string; // e.g. https://api.github.com/repos/owner/name
  pull_request?: unknown; // present if this "issue" is actually a PR — must filter out
}

export interface GithubRepoDetails {
  id: number;
  full_name: string;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  fork: boolean;
}

// Common language names GitHub recognizes as a repo's primary `language`.
// Anything NOT in this set is treated as a "topic" instead.
const KNOWN_LANGUAGES = new Set([
  "javascript", "typescript", "python", "java", "go", "rust", "c", "cpp",
  "csharp", "php", "ruby", "swift", "kotlin", "dart", "html", "css",
  "shell", "r", "scala", "elixir", "haskell",
]);

export function isLanguageTag(tag: string): boolean {
  return KNOWN_LANGUAGES.has(tag.toLowerCase());
}

// Searches issues directly by programming language.
export async function searchIssuesByLanguage(
  token: string,
  language: string,
  perPage = 20
): Promise<GithubIssueSearchItem[]> {
  const q = encodeURIComponent(
    `is:issue is:open label:"good first issue" language:${language}`
  );
  const data = await githubFetch<{ items: GithubIssueSearchItem[] }>(
    `/search/issues?q=${q}&per_page=${perPage}&sort=updated`,
    token
  );
  return data.items;
}

// Finds repos tagged with a given topic (e.g. "devops", "ai-agents").
export async function searchReposByTopic(
  token: string,
  topic: string,
  perPage = 10
): Promise<{ full_name: string }[]> {
  const q = encodeURIComponent(`topic:${topic}`);
  const data = await githubFetch<{ items: { full_name: string }[] }>(
    `/search/repositories?q=${q}&per_page=${perPage}&sort=stars`,
    token
  );
  return data.items;
}

// Searches issues within a specific repo — used for topic-based tags,
// since GitHub's issue search has no direct "topic:" qualifier.
export async function searchIssuesInRepo(
  token: string,
  fullName: string,
  perPage = 10
): Promise<GithubIssueSearchItem[]> {
  const q = encodeURIComponent(
    `repo:${fullName} is:issue is:open label:"good first issue"`
  );
  const data = await githubFetch<{ items: GithubIssueSearchItem[] }>(
    `/search/issues?q=${q}&per_page=${perPage}`,
    token
  );
  return data.items;
}

// Fetches full repo details — used when we find an issue in a repo
// we don't have a `repositories` row for yet.
export async function fetchRepoDetails(
  token: string,
  fullName: string
): Promise<GithubRepoDetails> {
  return githubFetch<GithubRepoDetails>(`/repos/${fullName}`, token);
}


// Approximates "open PRs linked to this issue" by searching for open PRs
// in the same repo whose body mentions the issue number. GitHub's REST
// API has no direct issue->PR link endpoint, so this is the standard
// heuristic (catches "Fixes #123", "Closes #123", etc.)
export async function fetchOpenPRCountForIssue(
  token: string,
  fullName: string,
  issueNumber: number
): Promise<number> {
  const q = encodeURIComponent(
    `repo:${fullName} is:pr is:open ${issueNumber} in:body`
  );
  const data = await githubFetch<{ total_count: number }>(
    `/search/issues?q=${q}&per_page=1`,
    token
  );
  return data.total_count;
}