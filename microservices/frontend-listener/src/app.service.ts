import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { readFile, writeFile } from 'fs/promises';

export type Dataset = 'ATL' | 'AGPT' | 'PF';

@Injectable()
export class AppService {
  constructor(@Inject('KAFKA') private readonly client: ClientKafka) {}

  async updateLatestData(dataset: Dataset, timestamp: string) {
    const buffer = await readFile('./latest_data.json');
    const timestamps = JSON.parse(buffer.toString());
    timestamps[dataset] = timestamp;
    await writeFile('./latest_data.json', JSON.stringify(timestamps));
  }

  async getLatestData(dataset: Dataset) {
    const buffer = await readFile('./latest_data.json');
    const timestamps = JSON.parse(buffer.toString());
    return { dataset: dataset, latest_timestamp: timestamps[dataset] };
  }

  async reset() {
    const data = {
      ATL: '1970-01-01T00:00:00.000Z',
      AGPT: '1970-01-01T00:00:00.000Z',
      PF: '1970-01-01T00:00:00.000Z',
    };
    await writeFile('./latest_data.json', JSON.stringify(data));
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
