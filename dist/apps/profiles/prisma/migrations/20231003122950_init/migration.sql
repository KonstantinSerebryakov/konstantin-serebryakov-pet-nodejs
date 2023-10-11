/*
  Warnings:

  - You are about to drop the `Credentials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credentials" DROP CONSTRAINT "Credentials_profileId_fkey";

-- DropTable
DROP TABLE "Credentials";

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" DATE,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credential_id_key" ON "Credential"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_profileId_key" ON "Credential"("profileId");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
