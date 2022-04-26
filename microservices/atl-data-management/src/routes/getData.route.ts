import { Data } from 'src/entities/data.entity';
import { Params } from 'src/input/params.input';
import { Between, EntityManager } from 'typeorm';

export async function getDataRoute(
  params: Params,
  manager: EntityManager,
): Promise<Data[]> {
  // Perform query and return results
  return manager.find(Data, {
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
}
