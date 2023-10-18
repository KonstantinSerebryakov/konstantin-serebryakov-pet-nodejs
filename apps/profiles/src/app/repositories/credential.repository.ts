import {
  Injectable,
} from '@nestjs/common';
import {
  Prisma,
  PrismaService,
} from '@konstantin-serebryakov-pet-nodejs/prisma-client-profiles';
import { CredentialEntity } from '../entities/credential.entity';

@Injectable()
export class CredentialRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
