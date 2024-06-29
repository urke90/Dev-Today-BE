/*
  Warnings:

  - You are about to drop the column `storyTags` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "storyTags",
ADD COLUMN     "tags" TEXT[];
