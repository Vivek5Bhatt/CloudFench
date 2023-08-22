/*
  Warnings:

  - Added the required column `az` to the `Deployments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Deployments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instance` to the `Deployments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Deployments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployments" ADD COLUMN     "az" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "instance" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL;
