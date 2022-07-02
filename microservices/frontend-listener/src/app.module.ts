import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './auth/jwtStrategy';
import { kafkaClientOptions } from './utils/kafkaOptions';
import { TypeOrmModule } from '@nestjs/typeorm';

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
          client: kafkaClientOptions,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
