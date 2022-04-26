import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables from file
    TypeOrmModule.forRoot(), // Load TypeORM configuration from file
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
