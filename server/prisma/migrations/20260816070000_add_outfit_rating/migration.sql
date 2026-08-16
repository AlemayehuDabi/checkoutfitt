-- CreateTable
CREATE TABLE "outfit_rating" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "imageAttachmentId" TEXT NOT NULL,
    "colorHarmonyScore" DOUBLE PRECISION NOT NULL,
    "fitScore" DOUBLE PRECISION NOT NULL,
    "occasionMatchScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "occasion" TEXT,
    "suggestions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outfit_rating_ownerId_createdAt_idx" ON "outfit_rating"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "outfit_rating_imageAttachmentId_idx" ON "outfit_rating"("imageAttachmentId");

-- AddForeignKey
ALTER TABLE "outfit_rating" ADD CONSTRAINT "outfit_rating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_rating" ADD CONSTRAINT "outfit_rating_imageAttachmentId_fkey" FOREIGN KEY ("imageAttachmentId") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

