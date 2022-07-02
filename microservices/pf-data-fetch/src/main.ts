import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { kafkaClientOptions } from './utils/kafkaClientOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: kafkaClientOptions,
      consumer: {
        groupId: process.env.GROUP_ID,
      },
    },
  });
  await app.startAllMicroservices();
  app.listen(process.env.PORT);
}
bootstrap();
