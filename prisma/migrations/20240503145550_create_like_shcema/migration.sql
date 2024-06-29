/*
  Warnings:

  - You are about to drop the column `likes` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "likes",
DROP COLUMN "views",
ADD COLUMN     "likesCount" INTEGER DEFAULT 0,
ADD COLUMN     "viewsCount" INTEGER DEFAULT 0,
ALTER COLUMN "type" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Like" (
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("userId","contentId","commentId")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
