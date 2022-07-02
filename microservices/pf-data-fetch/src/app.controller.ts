import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { messageLog } from './utils/messageLog';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(process.env.ADMIN_TOPIC)
  async adminOperation(message: { value: { operation: string } }) {
    if (message.value.operation === 'FETCH') {
      messageLog('Received FETCH event');
      await this.appService.fetchFile();
    } else if (message.value.operation === 'STATUS') {
      messageLog('Received STATUS event');
      this.appService.status();
    }
  }
}
