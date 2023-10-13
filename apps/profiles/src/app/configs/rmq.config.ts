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
        vhost: process.env.AMQP_VHOSTNAME ?? '',
        host: process.env.AMQP_HOSTNAME ?? '',
      },
    ],
    queueName: process.env.AMQP_QUEUE_PROFILES,
    prefetchCount: 32,
    serviceName: 'rmq-profiles',
  }),
});
