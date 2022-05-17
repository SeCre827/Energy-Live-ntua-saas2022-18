import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(process.env.FETCH_TOPIC)
  async fetchFile() {
    await this.appService.fetchFile();
  }

  @EventPattern(process.env.STATUS_TOPIC)
  status() {
    this.appService.status();
  }
}
