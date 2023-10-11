/*
  Warnings:

  - A unique constraint covering the columns `[profileId,variantId]` on the table `SocialMediaNode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaNode_profileId_variantId_key" ON "SocialMediaNode"("profileId", "variantId");
