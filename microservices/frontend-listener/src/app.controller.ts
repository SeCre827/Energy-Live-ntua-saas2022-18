import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/atl-latest')
  async getLatestATL() {
    return await this.appService.getLatestData('ATL');
  }

  @Get('/agpt-latest')
  async getLatestAGPT() {
    return await this.appService.getLatestData('AGPT');
  }

  @Get('/pf-latest')
  async getLatestPF() {
    return await this.appService.getLatestData('PF');
  }

  @EventPattern(process.env.NEW_ATL_DATA_TOPIC)
  async newATLData(message: { value: { timestamp: string } }) {
    await this.appService.updateLatestData('ATL', message.value.timestamp);
  }

  @EventPattern(process.env.NEW_AGPT_DATA_TOPIC)
  async newAGPTData(message: { value: { timestamp: string } }) {
    await this.appService.updateLatestData('AGPT', message.value.timestamp);
  }

  @EventPattern(process.env.NEW_PF_DATA_TOPIC)
  async newPFData(message: { value: { timestamp: string } }) {
    await this.appService.updateLatestData('PF', message.value.timestamp);
  }

  @EventPattern(process.env.RESET_TOPIC)
  async reset() {
    await this.appService.reset();
  }

  @EventPattern(process.env.STATUS_TOPIC)
  status() {
    this.appService.status();
  }
}
