-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_groupId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
