import { DateTime } from 'luxon';
import { Country, ResolutionCodeType } from 'src/entities/country.entity';
import { Data } from 'src/entities/data.entity';
import { DataDto } from 'src/input/data-dto.input';
import { Between, EntityManager, In } from 'typeorm';

export async function postDataRoute(
  dataDto: DataDto,
  manager: EntityManager,
): Promise<void> {
  // Retrieve information about all countries
  const countries = await manager.find(Country);

  // Find the index of each country in the countries array
  const index = new Map<string, number>();
  for (const [idx, country] of countries.entries()) {
    index.set(country.id, idx);
  }

  // Initialise arrays of data to delete and data to insert
  const deleteData = new Array<Data>();
  const insertData = new Array<Data>();

  // Find first and last timestamp for which data will be imported
  // Note that we keep all timestamp strings in ISO format and UTC timezone
  const lastDt = DateTime.fromISO(dataDto.timestamp, { zone: 'utc' });
  const firstDt = lastDt.startOf('month');

  // Initialise array of countries whose resolution codes have changed
  const resCodeChanged = new Array<string>();

  // Iterate through the countryData objects, one for each country
  for (const {
    country_id: id,
    resolution_code: res,
    entries,
  } of dataDto.country_data) {
    // Map each timestamp in the imported entries to its corresponding value
    const timestampMap = new Map<string, string>();
    for (const { timestamp, value } of entries) {
      timestampMap.set(timestamp, value);
    }

    // Check if the current resolution code of the country matches
    // the updated one in the dataDto. If yes, delete all existing data
    // for that country and insert all new data for that country.
    if (countries[index.get(id)].resolution_code != res) {
      countries[index.get(id)].resolution_code = res;
      resCodeChanged.push(id);
      for (const [timestamp, value] of timestampMap.entries()) {
        insertData.push(newDataObj(manager, id, timestamp, value));
      }
      continue;
    }

    // Fetch all existing data for current country, between firstDt and lastDt
    // Also convert all timestamps to ISO string format in UTC timezone
    const oldData = await manager.find(Data, {
      where: {
        country: {
          id: id,
        },
        timestamp: Between(firstDt.toISO(), lastDt.toISO()),
      },
    });

    // If there are any timestamps missing (according to the country's
    // resolution code), add them and set their values to null
    for (let dt = firstDt; dt < lastDt; dt = incrementDt(dt, res)) {
      const timestamp = dt.toISO();
      if (!timestampMap.has(timestamp)) {
        timestampMap.set(timestamp, null);
      }
    }

    // Find the existing data that need to be updated, i.e. the entries
    // whose new value is different than the old one. Delete the old
    // values and insert the new ones.
    for (const entry of oldData) {
      // Convert timestamp from Date object to ISO string in UTC timezone
      // Normally, the Date object returned by the database query is already
      // in UTC timezone, but it is better practice not to take it as granted.
      const timestamp = DateTime.fromJSDate(entry.timestamp, {
        zone: 'utc',
      }).toISO();

      // Check if new value for timestamp is different than old value
      if (timestampMap.get(timestamp) !== entry.value) {
        deleteData.push(newDataObj(manager, id, timestamp, entry.value));
        insertData.push(
          newDataObj(manager, id, timestamp, timestampMap.get(timestamp)),
        );
      }
      // Delete the current entry from the map, so that after this
      // for-loop only the new entries remain (i.e. those whose
      // timestamps do not exist in the database)
      timestampMap.delete(timestamp);
    }

    // Add all new entries to the database
    for (const [timestamp, value] of timestampMap.entries()) {
      insertData.push(newDataObj(manager, id, timestamp, value));
    }
  }

  await manager.transaction(async (manager) => {
    // Delete all existing data that should be updated
    await manager.delete(Data, { country: { id: In(resCodeChanged) } });
    // Delete all existing data for countries whose resolution code changed
    await manager.remove(deleteData, { chunk: 1000 });
    // Insert all new and updated data
    await bulkDataInsert(manager, insertData, 1000);
    // Update countries whose resolution code changed
    await manager.save(countries);
  });
}

function incrementDt(dt: DateTime, res: ResolutionCodeType): DateTime {
  if (res === 'PT15M') {
    return dt.plus({ minutes: 15 });
  } else if (res === 'PT30M') {
    return dt.plus({ minutes: 30 });
  } else if (res === 'PT60M') {
    return dt.plus({ minutes: 60 });
  }
}

function newDataObj(
  manager: EntityManager,
  country_id: string,
  timestamp: string,
  value: string,
): Data {
  return manager.create(Data, {
    country: { id: country_id },
    timestamp: timestamp,
    value: value,
  });
}

async function bulkDataInsert(
  manager: EntityManager,
  data: Data[],
  chunk: number,
): Promise<void> {
  for (let k = 0; k < data.length; k += chunk) {
    await manager
      .createQueryBuilder()
      .insert()
      .into(Data)
      .values(data.slice(k, k + chunk >= data.length ? data.length : k + chunk))
      .execute();
  }
}
