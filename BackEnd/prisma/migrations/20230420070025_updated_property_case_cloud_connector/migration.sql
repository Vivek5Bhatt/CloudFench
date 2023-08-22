/*
  Warnings:

  - You are about to drop the column `AccessKey` on the `CloudConnector` table. All the data in the column will be lost.
  - You are about to drop the column `AccountId` on the `CloudConnector` table. All the data in the column will be lost.
  - Added the required column `accessKey` to the `CloudConnector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `CloudConnector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloudConnector" DROP COLUMN "AccessKey",
DROP COLUMN "AccountId",
ADD COLUMN     "accessKey" TEXT NOT NULL,
ADD COLUMN     "accountId" TEXT NOT NULL;
