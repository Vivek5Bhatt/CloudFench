/*
  Warnings:

  - You are about to drop the column `tgwArn` on the `Deployments` table. All the data in the column will be lost.
  - You are about to drop the column `tgwId` on the `Deployments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deployments" DROP COLUMN "tgwArn",
DROP COLUMN "tgwId",
ADD COLUMN     "twgArn" TEXT,
ADD COLUMN     "twgId" TEXT;
