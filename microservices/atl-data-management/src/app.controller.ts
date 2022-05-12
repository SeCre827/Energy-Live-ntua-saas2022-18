import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Params } from './input/params.input';
import { ParamsValidationPipe } from './pipes/params-validation.pipe';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getData/:countryID/:dateFrom/:dateTo')
  async getData(@Param(ParamsValidationPipe) params: Params) {
    return this.appService.getData(params);
  }

  @EventPattern(process.env.FETCHED_DATA_TOPIC)
  async importData(file: { value: { id: string } }) {
    await this.appService.importData(file.value.id);
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
