/*
  Warnings:

  - You are about to drop the column `secretManager` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deployments" ADD COLUMN     "securenatgwHubTgwRtb" TEXT,
ADD COLUMN     "securenatgwSpokeTgwRtb" TEXT,
ADD COLUMN     "tgwArn" TEXT,
ADD COLUMN     "tgwId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "secretManager";
