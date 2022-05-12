import { DataDto } from 'src/input/data-dto.input';

export function zeroPad(data: DataDto) {
  // Zero-pad all values so that they have 2 decimal places
  for (const country of data.country_data) {
    country.entries = country.entries.map((entry) => {
      const [integer, fractional] = entry.value.split('.');
      return {
        timestamp: entry.timestamp,
        value: integer + '.' + fractional.padEnd(2, '0'),
      };
    });
  }
  return data;
}
