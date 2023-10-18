import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaService,
} from '@konstantin-serebryakov-pet-nodejs/prisma-client-profiles';
import { SocialMediaNodeEntity } from '../entities/socialMediaNode.entity';
import { SocialMediaVariantEntity } from '../entities/socialMediaVariant.entity';

@Injectable()
export class SocialMediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  //
  // SOCIAL_MEDIA_NODES
  //

  async findSocialMediaNodesNestedByProfileId(profileId: string) {
    const queried = await this.prisma.socialMediaNode.findMany({
      where: {
        profileId: profileId,
      },
      include: { socialMediaVariant: true },
    });
    return queried.map((node) => {
      return new SocialMediaNodeEntity(node);
    });
  }

  async findSocialMediaNodesUniqueFieldsByProfileId(profileId: string) {
    const queried = await this.prisma.socialMediaNode.findMany({
      where: {
        profileId: profileId,
      },
      select: { profileId: true, variantId: true },
    });
    return queried;
  }

  async findExistedSocialMediaNodes(socialMediaNodeIds: string[]) {
    const queried = await this.prisma.socialMediaNode.findMany({
      where: { id: { in: socialMediaNodeIds } },
      include: { socialMediaVariant: true },
    });
    return queried.map((node) => new SocialMediaNodeEntity(node));
  }

  private async generateSocialMediaNodesCreateManyInput(
    profileId: string,
    socialMediaNodes: SocialMediaNodeEntity[]
  ): Promise<Prisma.SocialMediaNodeCreateManyInput[]> {
    const createManyInput: Prisma.SocialMediaNodeCreateManyInput[] =
      socialMediaNodes.map((node) => {
        const variantId = node.socialMediaVariant.id;
        if (!variantId) throw new Error('variantId is not defined');
        return {
          ...node.getPublicSelf(),
          profileId: profileId,
          variantId: variantId,
        };
      });
    return createManyInput;
  }
  async deleteSocialMediasByProfileId(profileId: string) {
    return this.prisma.socialMediaNode.deleteMany({
      where: { profileId: profileId },
    });
  }
  private async queryCreateManySocialMediaNodes(
    createManyInput: Prisma.SocialMediaNodeCreateManyInput[]
  ) {
    return this.prisma.socialMediaNode.createMany({
      data: createManyInput,
      skipDuplicates: true,
    });
  }
  async updateSocialMedias(
    profileId: string,
    socialMediaNodes: SocialMediaNodeEntity[]
  ) {
    try {
      const createInput = await this.generateSocialMediaNodesCreateManyInput(
        profileId,
        socialMediaNodes
      );
      const deleteResult = await this.deleteSocialMediasByProfileId(profileId);
      const createResult = await this.queryCreateManySocialMediaNodes(
        createInput
      );
      return createResult;
    } catch (e) {
      if (e instanceof Error) throw new BadRequestException(e.message);
      throw new BadRequestException();
    }
  }

  //
  // SOCIAL_MEDIAS_VARIANTS
  //

  private async queryExistedSocialMediaVariantsByNames(
    names: string[],
    select: Prisma.SocialMediaVariantSelect | null = null
  ) {
    return this.prisma.socialMediaVariant.findMany({
      select: select,
      where: {
        name: {
          in: names,
        },
      },
      orderBy: {
        name: Prisma.SortOrder.asc,
      },
    });
  }
  async findExistedSocialMediaVariantIdsByNames(names: string[]) {
    const queried = await this.queryExistedSocialMediaVariantsByNames(names, {
      id: true,
    });
    return queried.map((variant) => variant.id);
  }
  async findExistedSocialMediaVariantNamesByNames(names: string[]) {
    const queried = await this.queryExistedSocialMediaVariantsByNames(names, {
      id: true,
    });
    return queried.map((variant) => variant.name);
  }
  async findExistedSocialMediaVariantsByNames(names: string[]) {
    const queried = await this.queryExistedSocialMediaVariantsByNames(names);
    return queried.map((variant) => {
      return new SocialMediaVariantEntity(variant);
    });
  }

  async createSocialMediaVariants(variants: SocialMediaVariantEntity[]) {
    return this.prisma.socialMediaVariant.createMany({
      data: variants.map((variant) => variant.getPublic()),
      skipDuplicates: true,
    });
  }
}
