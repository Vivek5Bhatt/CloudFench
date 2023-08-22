-- CreateTable
CREATE TABLE "CloudConnector" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cloud" TEXT NOT NULL,

    CONSTRAINT "CloudConnector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudConnector_id_key" ON "CloudConnector"("id");

-- AddForeignKey
ALTER TABLE "CloudConnector" ADD CONSTRAINT "CloudConnector_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
