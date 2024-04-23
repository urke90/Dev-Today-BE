/*
  Warnings:

  - You are about to drop the column `isOnboarding` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnboarding",
ADD COLUMN     "isOnboardingCompleted" BOOLEAN;
