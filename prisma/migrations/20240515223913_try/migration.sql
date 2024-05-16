/*
  Warnings:

  - You are about to drop the column `groupId` on the `GroupUser` table. All the data in the column will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupUser" DROP CONSTRAINT "GroupUser_groupId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupUser" DROP COLUMN "groupId";

-- DropTable
DROP TABLE "_GroupToUser";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
