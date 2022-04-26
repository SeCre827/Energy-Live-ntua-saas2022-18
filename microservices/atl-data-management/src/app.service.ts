import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Params } from './input/params.input';
import { Data } from './entities/data.entity';
import { DataDto } from './input/data-dto.input';
import { getDataRoute } from './routes/getData.route';
import { postDataRoute } from './routes/postData.route';
import { resetRoute } from './routes/reset.route';

@Injectable()
export class AppService {
  constructor(@InjectEntityManager() private manager: EntityManager) {}

  async getData(params: Params): Promise<Data[]> {
    return getDataRoute(params, this.manager);
  }

  async postData(dataDto: DataDto): Promise<void> {
    return postDataRoute(dataDto, this.manager);
  }

  async reset(): Promise<void> {
    return resetRoute(this.manager);
  }
}
