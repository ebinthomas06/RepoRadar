-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "github_id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
    "preferred_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "min_solvability" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "min_repo_stars" INTEGER NOT NULL DEFAULT 50,
    "email_alerts" BOOLEAN NOT NULL DEFAULT true,
    "digest_freq" VARCHAR(20) NOT NULL DEFAULT 'DAILY',

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "github_repo_id" BIGINT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "stars_count" INTEGER NOT NULL DEFAULT 0,
    "health_score" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "last_etag" VARCHAR(255),
    "scraped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repository_id" UUID NOT NULL,
    "github_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "solvability_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "open_prs_count" INTEGER NOT NULL DEFAULT 0,
    "github_created_at" TIMESTAMP(3) NOT NULL,
    "is_dirty" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_bookmarks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "issue_id" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'SAVED',

    CONSTRAINT "user_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digest_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "issue_id" UUID NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digest_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_preferences_preferred_tags_idx" ON "user_preferences" USING GIN ("preferred_tags");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_github_repo_id_key" ON "repositories"("github_repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_full_name_key" ON "repositories"("full_name");

-- CreateIndex
CREATE INDEX "issues_labels_idx" ON "issues" USING GIN ("labels");

-- CreateIndex
CREATE UNIQUE INDEX "issues_repository_id_github_number_key" ON "issues"("repository_id", "github_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_bookmarks_user_id_issue_id_key" ON "user_bookmarks"("user_id", "issue_id");

-- CreateIndex
CREATE INDEX "idx_digest_user_issue" ON "digest_logs"("user_id", "issue_id", "sent_at" DESC);

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digest_logs" ADD CONSTRAINT "digest_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digest_logs" ADD CONSTRAINT "digest_logs_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
