import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Params } from './input/params.input';
import { EventPattern } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { messageLog } from './utils/messageLog';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/getData/:countryID/:dateFrom/:dateTo')
  async getData(@Param() params: Params) {
    return this.appService.getData(params);
  }

  @EventPattern(process.env.FETCHED_TOPIC)
  async importData(message: { value: { dataset: string; file_id: string } }) {
    if (message.value.dataset === 'ATL') {
      messageLog('Received FETCHED event');
      await this.appService.importData(message.value.file_id);
    }
  }

  @EventPattern(process.env.ADMIN_TOPIC)
  async adminOperation(message: { value: { operation: string } }) {
    if (message.value.operation === 'RESET') {
      messageLog('Received RESET event');
      await this.appService.reset();
    } else if (message.value.operation === 'STATUS') {
      messageLog('Received STATUS event');
      this.appService.status();
    }
  }
}
