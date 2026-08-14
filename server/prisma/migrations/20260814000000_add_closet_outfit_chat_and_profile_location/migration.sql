-- CreateEnum
CREATE TYPE "AttachmentPurpose" AS ENUM ('CLOSET_ITEM', 'CHAT_ATTACHMENT', 'AVATAR', 'OTHER');

-- CreateEnum
CREATE TYPE "ClosetItemStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "ClosetItemType" AS ENUM ('TOP', 'BOTTOM', 'OUTERWEAR', 'DRESS', 'FOOTWEAR', 'ACCESSORY', 'BAG', 'OTHER');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "attachment" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "format" TEXT,
    "bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "purpose" "AttachmentPurpose" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closet_item" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "attachmentId" TEXT,
    "type" "ClosetItemType",
    "category" TEXT,
    "color" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ClosetItemStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "closet_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_message" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "attachedImageUrl" TEXT,
    "outfitCardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OutfitItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OutfitItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachment_publicId_key" ON "attachment"("publicId");

-- CreateIndex
CREATE INDEX "attachment_ownerId_idx" ON "attachment"("ownerId");

-- CreateIndex
CREATE INDEX "closet_item_ownerId_idx" ON "closet_item"("ownerId");

-- CreateIndex
CREATE INDEX "closet_item_ownerId_archived_idx" ON "closet_item"("ownerId", "archived");

-- CreateIndex
CREATE INDEX "outfit_ownerId_idx" ON "outfit"("ownerId");

-- CreateIndex
CREATE INDEX "outfit_ownerId_saved_idx" ON "outfit"("ownerId", "saved");

-- CreateIndex
CREATE INDEX "chat_message_ownerId_createdAt_idx" ON "chat_message"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "_OutfitItems_B_index" ON "_OutfitItems"("B");

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closet_item" ADD CONSTRAINT "closet_item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closet_item" ADD CONSTRAINT "closet_item_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_outfitCardId_fkey" FOREIGN KEY ("outfitCardId") REFERENCES "outfit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OutfitItems" ADD CONSTRAINT "_OutfitItems_A_fkey" FOREIGN KEY ("A") REFERENCES "closet_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OutfitItems" ADD CONSTRAINT "_OutfitItems_B_fkey" FOREIGN KEY ("B") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

