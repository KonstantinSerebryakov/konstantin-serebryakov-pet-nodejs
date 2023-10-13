// import dotenv from 'dotenv'
// dotenv.config()
import 'dotenv/config'
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.init();
	Logger.log(
		`🚀 Accounts microservice is running`
	);
}

bootstrap();
