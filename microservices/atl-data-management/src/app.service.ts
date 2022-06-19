import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Params } from './input/params.input';
import { Data } from './entities/data.entity';
import { getData } from './utils/getData';
import { downloadData } from './utils/downloadData';
import { validateData } from './utils/validateData';
import { storeData } from './utils/storeData';
import { Country } from './entities/country.entity';
import { ClientKafka } from '@nestjs/microservices';
import { readFile } from 'fs/promises';
import { zeroPad } from './utils/zeroPad';
import { validateParams } from './utils/validateParams';
import { DateTime } from 'luxon';
import { messageLog } from './utils/messageLog';

@Injectable()
export class AppService {
  constructor(
    @InjectEntityManager() private manager: EntityManager,
    @Inject('KAFKA') private readonly client: ClientKafka,
  ) {}

  async getData(params: Params) {
    // Check that request parameters are valid
    await validateParams(params, this.manager);

    // Convert from YYYYMMDD format to ISO format
    params.dateFrom = DateTime.fromISO(params.dateFrom, {
      zone: 'utc',
    }).toISO();
    params.dateTo = DateTime.fromISO(params.dateTo, { zone: 'utc' })
      .endOf('day')
      .toISO();

    // Return requested data from database
    return getData(params, this.manager);
  }

  async importData(fileId: string) {
    // Download JSON data from Google Drive
    const downloaded = await downloadData(fileId);

    // Check that data is valid
    await validateData(downloaded);

    // Zero-pad values to 2 decimal places
    const data = zeroPad(downloaded);

    // Store data in database
    await storeData(data, this.manager);

    // Publish STORED event
    this.client.emit(process.env.STORED_TOPIC, {
      dataset: 'ATL',
      timestamp: data.timestamp,
    });

    messageLog('Stored fetched entries into the database');
  }

  async reset() {
    // Read default country data from file
    const buffer = await readFile('countries_data.json');
    const countries = JSON.parse(buffer.toString());

    // Clear existing data and reset defaults
    this.manager.transaction(async (manager) => {
      await manager.clear(Data);
      await manager.createQueryBuilder().delete().from(Country).execute();
      await manager.insert(Country, countries);
    });

    // Publish ADMIN_RESPONSE event
    this.client.emit(process.env.ADMIN_RESPONSE_TOPIC, {
      name: 'atl-data-management',
      reset: 'OK',
    });
  }

  status() {
    // Publish ADMIN_RESPONSE event
    this.client.emit(process.env.ADMIN_RESPONSE_TOPIC, {
      name: 'atl-data-management',
      status: 'OK',
    });
  }
}
