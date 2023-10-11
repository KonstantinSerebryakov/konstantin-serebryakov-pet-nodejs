-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credentials" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" DATE,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "SocialMediaVariant" (
    "id" SERIAL NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SocialMediaVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_id_key" ON "Credentials"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_profileId_key" ON "Credentials"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaNode_id_key" ON "SocialMediaNode"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaVariant_id_key" ON "SocialMediaVariant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaVariant_name_key" ON "SocialMediaVariant"("name");

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaNode" ADD CONSTRAINT "SocialMediaNode_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaNode" ADD CONSTRAINT "SocialMediaNode_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "SocialMediaVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
