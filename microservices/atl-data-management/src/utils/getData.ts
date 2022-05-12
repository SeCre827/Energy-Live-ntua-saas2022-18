import { DateTime } from 'luxon';
import { Country } from 'src/entities/country.entity';
import { Data } from 'src/entities/data.entity';
import { Params } from 'src/input/params.input';
import { Between, EntityManager } from 'typeorm';

export async function getData(params: Params, manager: EntityManager) {
  // Record request timestamp
  const timestamp = DateTime.now().toISO();

  // Perform query to fetch requested data
  const data = await manager.find(Data, {
    select: ['timestamp', 'value'],
    where: {
      country: {
        id: params.countryID,
      },
      timestamp: Between(params.dateFrom, params.dateTo),
    },
    order: {
      timestamp: 'ASC',
    },
  });

  const country = await manager.findByIds(Country, [params.countryID], {
    select: ['name'],
  });

  // Return object with metadata
  return {
    countryId: params.countryID,
    countryName: country[0].name,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    timestamp: timestamp,
    data: data,
  };
}
