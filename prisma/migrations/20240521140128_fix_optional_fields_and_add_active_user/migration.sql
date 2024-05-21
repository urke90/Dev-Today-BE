/*
  Warnings:

  - Made the column `type` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentDescription` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `groupBio` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentKnowledge` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isOnboardingCompleted` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "contentDescription" SET NOT NULL;

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "groupBio" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActivUser" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "currentKnowledge" SET NOT NULL,
ALTER COLUMN "isOnboardingCompleted" SET NOT NULL,
ALTER COLUMN "isOnboardingCompleted" SET DEFAULT false;
