import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
	// inject: [ConfigService],
	// imports: [ConfigModule],
	// useFactory: (configService: ConfigService) => ({
	useFactory: () => ({
		exchangeName: process.env.AMQP_EXCHANGE ?? '',
		connections: [
			{
				login: process.env.AMQP_USER ?? '',
				password: process.env.AMQP_PASSWORD ?? '',
				host: process.env.AMQP_HOSTNAME ?? ''
			}
		],
		queueName: process.env.AMQP_QUEUE,
		prefetchCount: 32,
		serviceName: 'rmq-account'
		// exchangeName: configService.get('AMQP_EXCHANGE') ?? '',
		// connections: [
		// 	{
		// 		login: configService.get('AMQP_USER') ?? '',
		// 		password: configService.get('AMQP_PASSWORD') ?? '',
		// 		host: configService.get('AMQP_HOSTNAME') ?? ''
		// 	}
		// ],
		// queueName: configService.get('AMQP_QUEUE'),
		// prefetchCount: 32,
		// serviceName: 'rmq-account'
	})
})
