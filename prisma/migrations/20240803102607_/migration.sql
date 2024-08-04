/*
  Warnings:

  - You are about to drop the column `meetupLocation` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `meetupLocationImage` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "meetupLocation",
DROP COLUMN "meetupLocationImage";

-- CreateTable
CREATE TABLE "MeetupLocation" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "contentId" TEXT,

    CONSTRAINT "MeetupLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetupLocation_contentId_key" ON "MeetupLocation"("contentId");

-- AddForeignKey
ALTER TABLE "MeetupLocation" ADD CONSTRAINT "MeetupLocation_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
