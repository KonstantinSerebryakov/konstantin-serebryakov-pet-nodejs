import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ISocialMediaVariant } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { ProfileEntity } from '../entities/profile.entity';
import {
  Prisma,
  PrismaService,
} from '@konstantin-serebryakov-pet-nodejs/prisma-client-profiles';
import { CredentialEntity } from '../entities/credential.entity';
import { SocialMediaNodeEntity } from '../entities/socialMediaNode.entity';
import { SocialMediaVariantEntity } from '../entities/socialMediaVariant.entity';

@Injectable()
export class ProfilesRepository implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  //
  // DEFAULTS
  //
  defaultSocialMediaVariantIds: number[];

  async onModuleInit() {
    this.defaultSocialMediaVariantIds =
      await this.generateDefaultSocialMediaVariants();
  }

  async generateDefaultSocialMediaVariants() {
    const socialMediaVariants: ISocialMediaVariant[] = [
      { iconUrl: '111', name: '11111111111111111111111' },
      { iconUrl: '222', name: '22222222222222222222222' },
    ];

    return Promise.all(
      socialMediaVariants.map(async (variant) => {
        return this.prisma.socialMediaVariant
          .upsert({
            where: { name: variant.name },
            create: variant,
            update: {},
          })
          .then((variant) => variant.id);
      })
    );
  }

  async generateProfileDefault(userId: string) {
    const defaults: Prisma.ProfileCreateInput = {
      userId: userId,
      isDefault: true,
      credential: {
        create: {
          firstName: '',
          lastName: '',
          birthday: null,
        },
      },
      socialMediaNodes: {
        createMany: {
          data: this.defaultSocialMediaVariantIds.map((id) => {
            return {
              variantId: id,
              isActive: false,
              link: '',
            } as Prisma.SocialMediaNodeUncheckedCreateWithoutProfileInput;
          }),
          skipDuplicates: true,
        },
      },
    };

    return this.prisma.profile.create({
      data: defaults,
      select: {
        id: true,
        userId: true,
      },
    });
  }

  //
  // PROFILE
  //

  private async generateProfileCreateInputWithDefault(
    userId: string
  ): Promise<Prisma.ProfileCreateInput> {
    const defaultProfile = await this.findProfileDefaultNested(userId);

    const profileCreateInput: Prisma.ProfileCreateInput = {
      userId: userId,
      isDefault: false,
    };
    const credential = defaultProfile.credential?.getPublic();
    if (credential) {
      profileCreateInput.credential = {
        create: credential,
      };
    }
    const socialMedias = defaultProfile.socialMediaNodes?.map((socialMedia) => {
      return {
        ...socialMedia.getPublicSelf(),
        socialMediaVariant: {
          connect: socialMedia.socialMediaVariant.getPublic(),
        },
      };
    });
    if (socialMedias) {
      profileCreateInput.socialMediaNodes = {
        create: socialMedias,
      };
    }
    return profileCreateInput;
  }

  private async queryFindProfileSelf(
    filter: Prisma.ProfileWhereInput,
    select: Prisma.ProfileSelect = {}
  ) {
    const queriedObject = await this.prisma.profile.findFirst({
      where: filter,
      select: select,
    });

    if (!queriedObject)
      throw new NotFoundException('Profile not found in database!');

    return queriedObject;
  }

  private async queryFindProfileNested(filter: Prisma.ProfileWhereInput) {
    const queriedObject = await this.prisma.profile.findFirst({
      where: filter,
      include: {
        credential: true,
        socialMediaNodes: {
          include: {
            socialMediaVariant: true,
          },
        },
      },
    });
    if (!queriedObject)
      throw new NotFoundException('Profile not found in database!');

    return new ProfileEntity(queriedObject);
  }

  async findProfileDefaultNested(userId: string) {
    const filter = { isDefault: true, userId: userId };
    return this.queryFindProfileNested(filter);
  }

  async findProfileDefaultId(userId: string) {
    const filter = { isDefault: true, userId: userId };
    const select = { id: true };
    const queried = await this.queryFindProfileSelf(filter, select);
    return queried.id;
  }

  async findProfileNestedById(profileId: string) {
    const filter = { id: profileId };
    return this.queryFindProfileNested(filter);
  }

  async findManyProfileIdsByUserId(userId: string) {
    const queried = await this.prisma.profile.findMany({
      select: { id: true },
      where: { userId: userId },
    });

    return queried.map((item) => item.id);
  }

  async createProfile(userId: string) {
    const profileCreateInput = await this.generateProfileCreateInputWithDefault(
      userId
    );

    return this.prisma.profile.create({
      data: profileCreateInput,
      select: {
        id: true,
        userId: true,
      },
    });
  }

  async deleteProfileById(profileId: string) {
    return this.prisma.profile.delete({
      where: {
        id: profileId,
      },
      select: {
        id: true,
        userId: true,
      },
    });
  }

  async updateProfileSelf(profileId: string, profile: ProfileEntity) {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: profile.getPublicSelf(),
      select: { id: true, userId: true },
    });
  }

  //
  // CREDENTIAL
  //

  private async queryUpdateCredential(
    where: Prisma.CredentialWhereUniqueInput,
    credential: CredentialEntity
  ) {
    return this.prisma.credential.update({
      where: where,
      data: credential.getPublic(),
      select: {
        id: true,
        profileId: true,
      },
    });
  }

  async updateCredentialByProfileId(
    profileId: string,
    credential: CredentialEntity
  ) {
    return this.queryUpdateCredential(
      {
        profileId: profileId,
      },
      credential
    );
  }

  async updateCredentialById(id: string, credential: CredentialEntity) {
    return this.queryUpdateCredential(
      {
        id: id,
      },
      credential
    );
  }

  //
  // SOCIAL_MEDIAS
  //

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

  private async queryCreateManySocialMediaNodes(
    createManyInput: Prisma.SocialMediaNodeCreateManyInput[]
  ) {
    return this.prisma.socialMediaNode.createMany({
      data: createManyInput,
      skipDuplicates: true,
    });
  }

  async deleteSocialMediasByProfileId(profileId: string) {
    return this.prisma.socialMediaNode.deleteMany({
      where: { profileId: profileId },
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

  //
  // Utility
  //

  async isProfilePublic(profileId: string) {
    const queried = await this.prisma.publicProfile.findUnique({
      where: { profileId: profileId },
    });
    return !!queried;
  }

  async findManyPublicProfileIdsByUserId(userId: string) {
    const queried = await this.prisma.publicProfile.findMany({
      where: { profile: { userId: userId } },
      select: { profileId: true },
    });
    return queried.map((node) => node.profileId);
  }
}
