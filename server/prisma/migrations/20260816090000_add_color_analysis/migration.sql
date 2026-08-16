-- CreateTable
CREATE TABLE "color_analysis" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "imageAttachmentId" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "seasonTraits" JSONB NOT NULL,
    "bestColors" JSONB NOT NULL,
    "worstColors" JSONB NOT NULL,
    "undertone" TEXT NOT NULL,
    "contrast" TEXT NOT NULL,
    "proTip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "color_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "color_analysis_ownerId_key" ON "color_analysis"("ownerId");

-- CreateIndex
CREATE INDEX "color_analysis_imageAttachmentId_idx" ON "color_analysis"("imageAttachmentId");

-- AddForeignKey
ALTER TABLE "color_analysis" ADD CONSTRAINT "color_analysis_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "color_analysis" ADD CONSTRAINT "color_analysis_imageAttachmentId_fkey" FOREIGN KEY ("imageAttachmentId") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

