/*
  Warnings:

  - You are about to drop the column `coverImg` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupBio` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `bio` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "coverImg",
DROP COLUMN "groupBio",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";
