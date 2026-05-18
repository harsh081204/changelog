/*
  Warnings:

  - You are about to drop the column `raeDiff` on the `ChangelogEntry` table. All the data in the column will be lost.
  - Added the required column `rawDiff` to the `ChangelogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChangelogEntry" DROP COLUMN "raeDiff",
ADD COLUMN     "rawDiff" TEXT NOT NULL;
