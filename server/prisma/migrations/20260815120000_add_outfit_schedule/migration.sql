-- CreateTable
CREATE TABLE "outfit_schedule" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outfit_schedule_ownerId_idx" ON "outfit_schedule"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_schedule_ownerId_date_key" ON "outfit_schedule"("ownerId", "date");

-- AddForeignKey
ALTER TABLE "outfit_schedule" ADD CONSTRAINT "outfit_schedule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_schedule" ADD CONSTRAINT "outfit_schedule_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

