-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_contentId_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
