/*
  Warnings:

  - You are about to drop the column `meetUpDate` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `isActiveUser` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "meetUpDate",
ADD COLUMN     "meetupDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActiveUser";
