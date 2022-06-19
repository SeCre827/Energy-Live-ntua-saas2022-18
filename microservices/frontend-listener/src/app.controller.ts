import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AppService, Dataset } from './app.service';
import { messageLog } from './utils/messageLog';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/atl-latest')
  async getLatestATL() {
    return await this.appService.getLatestData('ATL');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/agpt-latest')
  async getLatestAGPT() {
    return await this.appService.getLatestData('AGPT');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/pf-latest')
  async getLatestPF() {
    return await this.appService.getLatestData('PF');
  }

  @EventPattern(process.env.STORED_TOPIC)
  async newData(message: { value: { dataset: Dataset; timestamp: string } }) {
    messageLog('Received STORED event');
    await this.appService.updateLatestData(
      message.value.dataset,
      message.value.timestamp,
    );
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
