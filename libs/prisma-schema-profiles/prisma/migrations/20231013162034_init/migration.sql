-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" DATE,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaNode" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "variantId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "SocialMediaNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "PublicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaVariant" (
    "id" SERIAL NOT NULL,
    "iconUrl" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "SocialMediaVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_id_key" ON "Credential"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_profileId_key" ON "Credential"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaNode_id_key" ON "SocialMediaNode"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaNode_profileId_variantId_key" ON "SocialMediaNode"("profileId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_id_key" ON "PublicProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_profileId_key" ON "PublicProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaVariant_id_key" ON "SocialMediaVariant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaVariant_name_key" ON "SocialMediaVariant"("name");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaNode" ADD CONSTRAINT "SocialMediaNode_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaNode" ADD CONSTRAINT "SocialMediaNode_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "SocialMediaVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicProfile" ADD CONSTRAINT "PublicProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
