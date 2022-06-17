import { parse } from 'csv';
import { finished } from 'stream/promises';
import { DataDto } from '../dto/dataDto';
import { Readable } from 'node:stream';
import { DateTime } from 'luxon';

interface UnfilteredEntry {
  DateTime: string;
  ResolutionCode: string;
  AreaCode: string;
  AreaTypeCode: string;
  AreaName: string;
  MapCode: string;
  ProductionType: string;
  ActualGenerationOutput: string;
  ActualConsumption: string;
  UpdateTime: string;
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

  // Initialise a dataDto object to return
  const dataDto: DataDto = {
    timestamp: '',
    countries_data: [],
  };

  // Initialise the last timestamp found
  let lastTimestamp = DateTime.fromMillis(0);

  // Determine the Parser's behaviour
  parser.on('readable', () => {
    let entry: UnfilteredEntry;

    // Parse the CSV line by line
    while ((entry = parser.read()) !== null) {
      // Filter out entries not referring to countries
      if (entry.AreaTypeCode !== 'CTY') {
        continue;
      }

      // Create a new entry in the countries_data array of dataDto
      const currTimestamp = DateTime.fromSQL(entry.DateTime, { zone: 'utc' });
      dataDto.countries_data.push({
        country_ID: entry.MapCode,
        production_type: entry.ProductionType,
        timestamp: currTimestamp.toISO(),
        value: entry.ActualGenerationOutput
          ? entry.ActualGenerationOutput
          : null,
      });

      // Update the last timestamp found
      const curr = DateTime.fromSQL(entry.DateTime, { zone: 'utc' });
      if (lastTimestamp < curr) {
        lastTimestamp = curr;
      }
    }
  });

  // Wait for the CSV to be parsed
  await finished(parser);

  // Set the dataDto object's timestamp to the latest found, then return it
  dataDto.timestamp = lastTimestamp.toISO();
  return dataDto;
}
