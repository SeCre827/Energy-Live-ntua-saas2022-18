import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.CLIENT_ID,
        brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
        ssl: true,
        sasl: {
          mechanism: 'scram-sha-256',
          username: process.env.CLOUDKARAFKA_USERNAME,
          password: process.env.CLOUDKARAFKA_PASSWORD,
        },
      },
      consumer: {
        groupId: process.env.GROUP_ID,
      },
    },
  });
  await app.startAllMicroservices();
  app.listen(process.env.PORT);
}
bootstrap();
