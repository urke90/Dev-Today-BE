/*
  Warnings:

  - The values [POSTS,MEETUP,PODCAST,GROUPS] on the enum `EContentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `postGroups` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EContentType_new" AS ENUM ('posts', 'meetups', 'podcasts');
ALTER TABLE "Content" ALTER COLUMN "type" TYPE "EContentType_new" USING ("type"::text::"EContentType_new");
ALTER TABLE "Group" ALTER COLUMN "type" TYPE "EContentType_new" USING ("type"::text::"EContentType_new");
ALTER TYPE "EContentType" RENAME TO "EContentType_old";
ALTER TYPE "EContentType_new" RENAME TO "EContentType";
DROP TYPE "EContentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContentGroup" DROP CONSTRAINT "ContentGroup_contentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentGroup" DROP CONSTRAINT "ContentGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "postGroups",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "ContentGroup";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "GroupUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
