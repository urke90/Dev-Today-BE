/*
  Warnings:

  - You are about to drop the column `isActivUser` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActivUser",
ADD COLUMN     "isActiveUser" BOOLEAN NOT NULL DEFAULT false;
