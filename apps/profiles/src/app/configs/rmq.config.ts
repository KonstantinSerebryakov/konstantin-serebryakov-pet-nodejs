import { IRMQServiceAsyncOptions, IRMQServiceOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  useFactory: ():IRMQServiceOptions => ({
    exchangeName: process.env.AMQP_EXCHANGE ?? '',
    connections: [
      {
        login: process.env.AMQP_USER ?? '',
        password: process.env.AMQP_PASSWORD ?? '',
        host: process.env.AMQP_HOSTNAME ?? '',
				vhost: process.env.AMQP_VHOSTNAME ?? ''
      },
    ],
    queueName: process.env.AMQP_QUEUE_PROFILES,
    prefetchCount: 32,
    serviceName: 'rmq-profiles',
  }),
});
