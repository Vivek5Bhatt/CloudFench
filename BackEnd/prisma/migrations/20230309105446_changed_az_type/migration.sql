/*
  Warnings:

  - The `az` column on the `Deployments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Deployments" DROP COLUMN "az",
ADD COLUMN     "az" TEXT[];
