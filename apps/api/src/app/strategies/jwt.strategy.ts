import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport'
import { IJWTPayload } from '@konstantin-serebryakov-pet-nodejs/interfaces';
import { ExtractJwt, Strategy } from 'passport-jwt';

const date = new Date();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET')
		})
	}

	async validate({ id, exp }: IJWTPayload) {
    const currentTimestamp = date.getTime() / 1000;
    if (exp < currentTimestamp) {
      throw new UnauthorizedException('Token has expired');
    }

		return id;
	}
}
