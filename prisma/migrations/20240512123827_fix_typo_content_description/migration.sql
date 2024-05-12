/*
  Warnings:

  - You are about to drop the column `contentDesrition` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "contentDesrition",
ADD COLUMN     "contentDescription" TEXT;
