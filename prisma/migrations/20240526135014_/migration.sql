/*
  Warnings:

  - You are about to drop the column `contentDescription` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `meetUpLocationImage` on the `Content` table. All the data in the column will be lost.
  - Added the required column `description` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "contentDescription",
DROP COLUMN "meetUpLocationImage",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "meetupLocationImage" TEXT;
