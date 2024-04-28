/*
  Warnings:

  - You are about to drop the column `content` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `gruopBio` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `_ContentToGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `commentText` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToGroup" DROP CONSTRAINT "_ContentToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToGroup" DROP CONSTRAINT "_ContentToGroup_B_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "content",
DROP COLUMN "postId",
ADD COLUMN     "commentText" TEXT NOT NULL,
ADD COLUMN     "contentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "gruopBio",
ADD COLUMN     "groupBio" TEXT;

-- DropTable
DROP TABLE "_ContentToGroup";

-- CreateTable
CREATE TABLE "ContentGroup" (
    "contentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ContentGroup_pkey" PRIMARY KEY ("contentId","groupId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGroup" ADD CONSTRAINT "ContentGroup_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGroup" ADD CONSTRAINT "ContentGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
