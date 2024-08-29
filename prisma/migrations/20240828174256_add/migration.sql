-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyingToId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyingToId_fkey" FOREIGN KEY ("replyingToId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
