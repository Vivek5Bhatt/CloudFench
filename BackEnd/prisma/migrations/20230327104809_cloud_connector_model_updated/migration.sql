/*
  Warnings:

  - Added the required column `status` to the `CloudConnector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloudConnector" ADD COLUMN     "status" TEXT NOT NULL;
