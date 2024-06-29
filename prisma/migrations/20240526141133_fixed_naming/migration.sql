/*
  Warnings:

  - You are about to drop the column `podcastAudiTitle` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `podcastAudioFile` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "podcastAudiTitle",
DROP COLUMN "podcastAudioFile",
ADD COLUMN     "podcastFile" TEXT,
ADD COLUMN     "podcastTitle" TEXT;
