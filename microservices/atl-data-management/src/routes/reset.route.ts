import { readFile } from 'fs/promises';
import { Country } from 'src/entities/country.entity';
import { Data } from 'src/entities/data.entity';
import { EntityManager } from 'typeorm';

export async function resetRoute(manager: EntityManager): Promise<void> {
  // Read default country data from file
  const buffer = await readFile('countries_data.json');
  const countries = JSON.parse(buffer.toString());
  manager.transaction(async (manager) => {
    await manager.clear(Data);
    await manager.createQueryBuilder().delete().from(Country).execute();
    await manager.insert(Country, countries);
  });
}
