/*
  Warnings:

  - Added the required column `AccessKey` to the `CloudConnector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AccountId` to the `CloudConnector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloudConnector" ADD COLUMN     "AccessKey" TEXT NOT NULL,
ADD COLUMN     "AccountId" TEXT NOT NULL;
