import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      uri: getMongoAtlasString(configService),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

const getMongoAtlasString = (configService: ConfigService) => {
	const login:string = "" + configService.get('MONGO_LOGIN');
	const password:string = "" + configService.get('MONGO_PASSWORD');
  const str =
    'mongodb+srv://' +
    encodeURIComponent(login) +
    ':' +
    encodeURIComponent(password) +
    '@' +
    configService.get('MONGO_URI') +
    '/' +
    configService.get('MONGO_URI_OPTIONS');
  console.log(str);
  return str;
};
