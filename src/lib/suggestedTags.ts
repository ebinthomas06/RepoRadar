// src/lib/suggestedTags.ts

// Curated list spanning languages AND domains/categories, so search
// surfaces things auto-detection might miss (e.g. someone into DevOps
// whose repos are all HCL/YAML, not "DevOps" as a language).
export const SUGGESTED_TAGS = [
  // Languages
  "javascript", "typescript", "python", "java", "go", "rust", "c", "cpp",
  "csharp", "php", "ruby", "swift", "kotlin", "dart", "html", "css",
  "shell", "r", "scala", "elixir", "haskell",

  // DevOps / Infra
  "devops", "kubernetes", "docker", "terraform", "aws", "gcp", "azure",
  "ci-cd", "ansible", "linux", "networking",

  // AI / Data
  "machine-learning", "deep-learning", "nlp", "computer-vision",
  "data-science", "data-engineering", "ai", "ai-agents", "llm",

  // Mobile
  "android", "ios", "flutter", "react-native", "mobile",

  // Web
  "frontend", "backend", "react", "vue", "nextjs", "graphql", "rest-api",
  "web", "api",

  // Data & Systems
  "database", "sql", "nosql", "distributed-systems", "microservices",
  "serverless",

  // Other domains
  "security", "cybersecurity", "blockchain", "web3", "game-development",
  "embedded", "iot", "cli-tool", "automation", "testing", "open-source",
  "ui-ux", "accessibility", "performance",
];