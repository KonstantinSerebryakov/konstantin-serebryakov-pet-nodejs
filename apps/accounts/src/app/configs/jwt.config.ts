import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
  // imports: [ConfigModule],
  // inject: [ConfigService],
  // useFactory: (configService: ConfigService) => ({
  useFactory: () => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXP_H,
    },
  }),
});
