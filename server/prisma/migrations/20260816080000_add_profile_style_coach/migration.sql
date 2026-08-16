-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "styleAnalyzedAt" TIMESTAMP(3),
ADD COLUMN     "styleArchetype" TEXT,
ADD COLUMN     "styleDescription" TEXT,
ADD COLUMN     "styleTraits" JSONB;

