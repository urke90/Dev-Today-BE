/*
  Warnings:

  - You are about to drop the column `tags` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagContent" (
    "tagId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "TagContent_pkey" PRIMARY KEY ("tagId","contentId")
);

-- AddForeignKey
ALTER TABLE "TagContent" ADD CONSTRAINT "TagContent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagContent" ADD CONSTRAINT "TagContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
