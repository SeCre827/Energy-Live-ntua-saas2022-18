import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA',
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
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
