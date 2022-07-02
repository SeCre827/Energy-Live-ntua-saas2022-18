type mechanismType = 'scram-sha-256';

// Set the Kafka client options according to the environment (production or development)
export const kafkaClientOptions =
  process.env.NODE_ENV === 'development'
    ? {
        clientId: process.env.CLIENT_ID,
        brokers: [process.env.KAFKA_URI],
      }
    : {
        clientId: process.env.CLIENT_ID,
        brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
        ssl: true,
        sasl: {
          mechanism: <mechanismType>'scram-sha-256',
          username: process.env.CLOUDKARAFKA_USERNAME,
          password: process.env.CLOUDKARAFKA_PASSWORD,
        },
      };
