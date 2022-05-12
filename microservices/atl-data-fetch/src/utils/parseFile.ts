import { parse } from 'csv';
import { finished } from 'stream/promises';
import { DateTime } from 'luxon';
import { DataDto } from '../dto/dataDto';
import { Readable } from 'node:stream';

interface UnfilteredEntry {
  DateTime: string;
  ResolutionCode: string;
  AreaCode: string;
  AreaTypeCode: string;
  AreaName: string;
  MapCode: string;
  TotalLoadValue: string;
  UpdateTime: string;
}

interface CountryData {
  resolution_code: string;
  entries: Array<{
    timestamp: string;
    value: string;
  }>;
}

export async function parseFile(instream: Readable) {
  // Initialise a Parser object to parse each row of the
  // downloaded CSV into a Javascript Object
  const parser = instream.pipe(
    parse({
      delimiter: '\t',
      columns: true,
    }),
  );

  // Initialise a Map object to map each country ID to its relevant data
  const countryDataMap = new Map<string, CountryData>();

  // Initialise a DateTime object to hold the last timestamp found
  let lastDt = DateTime.fromSeconds(0);

  // Determine the Parser's behaviour
  parser.on('readable', () => {
    let entry: UnfilteredEntry;

    // Parse the CSV line by line
    while ((entry = parser.read()) !== null) {
      // Filter out entries not referring to countries
      if (entry.AreaTypeCode !== 'CTY') {
        continue;
      }

      // Update the last timestamp found
      const currentDt = DateTime.fromSQL(entry.DateTime, { zone: 'utc' });
      if (currentDt > lastDt) {
        lastDt = currentDt;
      }

      // If the current entry is the first one referring to a country,
      // initialise that country's CountryData object in the countryDataMap
      // Otherwise, add the current entry's data to the country's existing
      // CountryData object in the countryDataMap
      const countryID = entry.MapCode;
      const data = {
        timestamp: DateTime.fromSQL(entry.DateTime, { zone: 'utc' }).toISO(),
        value: entry.TotalLoadValue,
      };
      if (!countryDataMap.has(countryID)) {
        countryDataMap.set(countryID, {
          resolution_code: entry.ResolutionCode,
          entries: [data],
        });
      } else {
        countryDataMap.get(countryID).entries.push(data);
      }
    }
  });

  // Wait for the CSV to be parsed
  await finished(parser);

  // Initialise a dataDto object to return
  const dataDto: DataDto = {
    timestamp: lastDt.toISO(),
    country_data: [],
  };

  // For each entry of the countryDataMap, create a corresponding entry in
  // the dataDto object
  for (const [countryID, countryData] of countryDataMap.entries()) {
    dataDto.country_data.push({
      country_id: countryID,
      resolution_code: countryData.resolution_code,
      entries: countryData.entries,
    });
  }

  return dataDto;
}
