import { parse } from 'csv';
import { finished } from 'stream/promises';
import { DataDto } from '../dto/dataDto';
import { Readable } from 'node:stream';
import { DateTime } from 'luxon';

interface UnfilteredEntry {
  DateTime: string;
  ResolutionCode: string;
  OutAreaCode: string;
  OutAreaTypeCode: string;
  OutAreaName: string;
  OutMapCode: string;
  InAreaCode: string;
  InAreaTypeCode: string;
  InAreaName: string;
  InMapCode: string;
  FlowValue: string;
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
    countries_pairs_data: [],
  };

  // Initialise the last timestamp found
  let timestamp = DateTime.fromMillis(0);

  // Determine the Parser's behaviour
  parser.on('readable', () => {
    let entry: UnfilteredEntry;

    // Parse the CSV line by line
    while ((entry = parser.read()) !== null) {
      // Filter out entries not referring to countries
      if (entry.OutAreaTypeCode !== 'CTY' || entry.InAreaTypeCode !== 'CTY') {
        continue;
      }

      // Create a new entry in the countries_pair_data array of dataDto
      dataDto.countries_pairs_data.push({
        countries_pair: entry.OutMapCode + '_' + entry.InMapCode,
        timestamp: entry.DateTime,
        value: entry.FlowValue,
      });

      // Update the last timestamp found
      const curr = DateTime.fromSQL(entry.DateTime, { zone: 'utc' });
      if (timestamp < curr) {
        timestamp = curr;
      }
    }
  });

  // Wait for the CSV to be parsed
  await finished(parser);

  // Set the dataDto object's timestamp to the latest found, then return it
  dataDto.timestamp = timestamp.toISO();
  return dataDto;
}
