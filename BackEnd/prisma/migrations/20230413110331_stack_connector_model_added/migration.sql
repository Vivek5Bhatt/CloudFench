-- CreateTable
CREATE TABLE "StackConnector" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cloudId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "StackConnector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StackConnector_id_key" ON "StackConnector"("id");

-- AddForeignKey
ALTER TABLE "StackConnector" ADD CONSTRAINT "StackConnector_cloudId_fkey" FOREIGN KEY ("cloudId") REFERENCES "CloudConnector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackConnector" ADD CONSTRAINT "StackConnector_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackConnector" ADD CONSTRAINT "StackConnector_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
