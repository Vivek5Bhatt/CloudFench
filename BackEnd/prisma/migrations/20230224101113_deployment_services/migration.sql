/*
  Warnings:

  - You are about to drop the column `description` on the `Deployments` table. All the data in the column will be lost.
  - Added the required column `cloud` to the `Deployments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services` to the `Deployments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployments" DROP COLUMN "description",
ADD COLUMN     "cloud" TEXT NOT NULL,
ADD COLUMN     "services" JSONB NOT NULL;
