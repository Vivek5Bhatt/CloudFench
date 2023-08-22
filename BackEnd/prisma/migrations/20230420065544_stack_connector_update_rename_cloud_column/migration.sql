/*
  Warnings:

  - You are about to drop the column `cloudId` on the `StackConnector` table. All the data in the column will be lost.
  - Added the required column `connectorId` to the `StackConnector` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StackConnector" DROP CONSTRAINT "StackConnector_cloudId_fkey";

-- AlterTable
ALTER TABLE "StackConnector" DROP COLUMN "cloudId",
ADD COLUMN     "connectorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StackConnector" ADD CONSTRAINT "StackConnector_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "CloudConnector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
