import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DataDto } from 'src/input/data-dto.input';
import { DataDtoSchema } from 'src/schemas/data-dto.schema';

export async function validateData(data: DataDto) {
  // Check if dataDto conforms to the DataDto schema;
  const { error } = DataDtoSchema.validate(data);
  if (error) {
    throw new BadRequestException();
  }

  // For each country's data, check if entries have valid timestamps
  for (const country of data.country_data) {
    const valid = country.entries.every(
      (entry) => DateTime.fromISO(entry.timestamp).isValid,
    );
    if (!valid) {
      throw new BadRequestException();
    }
  }
}
