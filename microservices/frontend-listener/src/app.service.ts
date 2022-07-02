import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { EntityManager } from 'typeorm';
import { Data } from './entities/data.entity';

export type Dataset = 'ATL' | 'AGPT' | 'PF';

@Injectable()
export class AppService {
  constructor(
    @InjectEntityManager() private manager: EntityManager,
    @Inject('KAFKA') private readonly client: ClientKafka,
  ) {}

  async updateLatestData(dataset: Dataset, timestamp: string) {
    const data = this.manager.create(Data, {
      dataset: dataset,
      timestamp: timestamp,
    });
    await this.manager.save(data);
  }

  async getLatestData(dataset: Dataset) {
    const data = await this.manager.findOne(Data, {
      where: { dataset: dataset },
    });
    return {
      dataset: dataset,
      latest_timestamp: DateTime.fromJSDate(data.timestamp, {
        zone: 'utc',
      }).toISO(),
    };
  }

  async reset() {
    const timestamp = '1970-01-01T00:00:00.000Z';
    const datasets = ['ATL', 'AGPT', 'PF'];
    const data = datasets.map((dataset) =>
      this.manager.create(Data, { dataset: dataset, timestamp: timestamp }),
    );
    await this.manager.save(data);
    this.client.emit(process.env.ADMIN_RESPONSE_TOPIC, {
      name: 'frontend-listener',
      reset: 'OK',
    });
  }

  status() {
    this.client.emit(process.env.ADMIN_RESPONSE_TOPIC, {
      name: 'frontend-listener',
      status: 'OK',
    });
  }
}
