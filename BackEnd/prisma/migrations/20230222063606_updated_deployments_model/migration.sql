/*
  Warnings:

  - Added the required column `userId` to the `Deployments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployments" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Deployments" ADD CONSTRAINT "Deployments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
