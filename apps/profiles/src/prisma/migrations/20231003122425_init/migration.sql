-- CreateTable
CREATE TABLE "PublicProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "PublicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_id_key" ON "PublicProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_profileId_key" ON "PublicProfile"("profileId");

-- AddForeignKey
ALTER TABLE "PublicProfile" ADD CONSTRAINT "PublicProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
