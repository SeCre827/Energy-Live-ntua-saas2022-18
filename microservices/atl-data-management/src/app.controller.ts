import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Params } from './input/params.input';
import { Data } from './entities/data.entity';
import { ParamsValidationPipe } from './pipes/params-validation.pipe';
import { DataDtoValidationPipe } from './pipes/data-dto-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtractJsonPipe } from './pipes/extract-json.pipe';
import { DataDto } from './input/data-dto.input';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getData/:countryID/:dateFrom/:dateTo')
  async getData(@Param(ParamsValidationPipe) params: Params): Promise<Data[]> {
    return this.appService.getData(params);
  }

  @Post('/postData')
  @UseInterceptors(FileInterceptor('data'))
  async postData(
    @UploadedFile(ExtractJsonPipe, DataDtoValidationPipe)
    dataDto: DataDto,
  ) {
    return this.appService.postData(dataDto);
  }

  @Post('/reset')
  async reset() {
    return this.appService.reset();
  }
}
