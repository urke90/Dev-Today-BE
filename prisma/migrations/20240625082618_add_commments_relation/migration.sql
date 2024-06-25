-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "replyingToId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyingToId_fkey" FOREIGN KEY ("replyingToId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
