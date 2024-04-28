/*
  Warnings:

  - You are about to drop the `POST` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToPOST` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "POST" DROP CONSTRAINT "POST_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToPOST" DROP CONSTRAINT "_GroupToPOST_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToPOST" DROP CONSTRAINT "_GroupToPOST_B_fkey";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "contentDesrition" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "meetUpDate" TIMESTAMP(3),
ADD COLUMN     "meetUpLocationImage" TEXT,
ADD COLUMN     "podcastAudiTitle" TEXT,
ADD COLUMN     "podcastAudioFile" TEXT,
ADD COLUMN     "postGroups" TEXT[],
ADD COLUMN     "storyTags" TEXT[],
ADD COLUMN     "title" TEXT;

-- DropTable
DROP TABLE "POST";

-- DropTable
DROP TABLE "_GroupToPOST";

-- CreateTable
CREATE TABLE "_ContentToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToGroup_AB_unique" ON "_ContentToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToGroup_B_index" ON "_ContentToGroup"("B");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToGroup" ADD CONSTRAINT "_ContentToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToGroup" ADD CONSTRAINT "_ContentToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
