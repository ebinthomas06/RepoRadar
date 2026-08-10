-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "language" TEXT,
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
