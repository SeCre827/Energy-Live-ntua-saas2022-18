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
        brokers: [process.env.KAFKA_URI],
      },
      consumer: {
        groupId: process.env.GROUP_ID,
      },
    },
  });
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
