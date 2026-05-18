/*
  Warnings:

  - The values [ARCHIEVED] on the enum `EntryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntryStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
ALTER TABLE "public"."ChangelogEntry" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ChangelogEntry" ALTER COLUMN "status" TYPE "EntryStatus_new" USING ("status"::text::"EntryStatus_new");
ALTER TYPE "EntryStatus" RENAME TO "EntryStatus_old";
ALTER TYPE "EntryStatus_new" RENAME TO "EntryStatus";
DROP TYPE "public"."EntryStatus_old";
ALTER TABLE "ChangelogEntry" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
