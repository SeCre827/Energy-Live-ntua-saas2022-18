import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwtStrategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
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
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
