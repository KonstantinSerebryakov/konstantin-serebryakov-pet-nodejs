import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import {
  ISocialMediaVariant,
} from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { ProfileEntity } from '../entities/profile.entity';
import {
  Prisma,
  PrismaService,
} from '@konstantin-serebryakov-pet-nodejs/prisma-client-profiles';

@Injectable()
export class ProfileRepository implements OnModuleInit {
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
      {
        iconUrl: 'https://img.icons8.com/material-outlined/24/linkedin--v1.png',
        name: 'LinkedIn',
      },
      {
        iconUrl: 'https://img.icons8.com/material-outlined/24/linkedin--v1.png',
        name: 'LinkedIn1',
      },
      {
        iconUrl: 'https://img.icons8.com/material-outlined/24/linkedin--v1.png',
        name: 'LinkedIn2',
      },
      {
        iconUrl: 'https://img.icons8.com/material-outlined/24/linkedin--v1.png',
        name: 'LinkedIn3',
      },
      {
        iconUrl: 'https://img.icons8.com/material-outlined/24/linkedin--v1.png',
        name: 'LinkedIn4',
      },
      {
        iconUrl: 'https://img.icons8.com/material-outlined/24/linkedin--v1.png',
        name: 'LinkedIn5',
      },
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
  async findProfileDefaultId(userId: string) {
    const filter = { isDefault: true, userId: userId };
    const select = { id: true };
    const queried = await this.queryFindProfileSelf(filter, select);
    return queried.id;
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
  async findManyProfileWithEssentialListByUserId(userId: string) {
    const queried = await this.prisma.profile.findMany({
      where: { userId: userId },
      include: { credential: true, essentialInfo: true },
    });
    return queried.map((item) => new ProfileEntity(item));
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
