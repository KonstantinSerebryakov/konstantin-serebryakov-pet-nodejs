-- CreateTable
CREATE TABLE "EssentialInfo" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "EssentialInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EssentialInfo_id_key" ON "EssentialInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EssentialInfo_profileId_key" ON "EssentialInfo"("profileId");

-- AddForeignKey
ALTER TABLE "EssentialInfo" ADD CONSTRAINT "EssentialInfo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
