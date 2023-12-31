import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IJWTPayload } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { v4 as getUuidV4 } from 'uuid';

const date = new Date();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET ?? getUuidV4().toString(),
    });
  }

  async validate({ id, exp }: IJWTPayload) {
    const currentTimestamp = date.getTime() / 1000;
    if (exp < currentTimestamp) {
      throw new UnauthorizedException('Token has expired');
    }

    return id;
  }
}
