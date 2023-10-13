// import dotenv from 'dotenv'
// dotenv.config()
import 'dotenv/config'
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  console.log(process.env.AMQP_EXCHANGE);
  Logger.log(process.env.AMQP_EXCHANGE);
  Logger.log(process.env.AMQP_EXCHANGE);
  Logger.log(process.env.AMQP_EXCHANGE);
  Logger.log(process.env.AMQP_EXCHANGE);
  Logger.log(process.env.AMQP_EXCHANGE);
	const app = await NestFactory.create(AppModule);
	await app.init();
	Logger.log(
		`🚀 Accounts microservice is running`
	);
}

bootstrap();
