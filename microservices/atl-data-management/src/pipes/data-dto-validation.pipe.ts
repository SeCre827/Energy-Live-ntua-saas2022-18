import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Country } from 'src/entities/country.entity';
import { DataDto } from 'src/input/data-dto.input';
import { DataDtoSchema } from 'src/schemas/data-dto.schema';
import { EntityManager } from 'typeorm';

@Injectable()
export class DataDtoValidationPipe implements PipeTransform {
  constructor(@InjectEntityManager() private manager: EntityManager) {}

  async transform(dataDto: DataDto): Promise<DataDto> {
    // Check if dataDto conforms to the DataDto schema
    const { error } = DataDtoSchema.validate(dataDto);
    if (error) {
      throw new BadRequestException();
    }

    // Check if all country_ids exist in the database
    const country_ids = dataDto.country_data.map((data) => data.country_id);
    const check = await this.manager.findByIds(Country, country_ids);
    if (check.length !== country_ids.length) {
      throw new BadRequestException();
    }

    // For each country's data
    for (const data of dataDto.country_data) {
      // Check if entries have valid timestamps
      if (
        data.entries.some((entry) => !DateTime.fromISO(entry.timestamp).isValid)
      ) {
        throw new BadRequestException();
      }

      // Zero-pad all values so that they have 2 decimal places
      data.entries = data.entries.map((entry) => {
        const [integer, fractional] = entry.value.split('.');
        return {
          timestamp: entry.timestamp,
          value: integer + '.' + fractional.padEnd(2, '0'),
        };
      });
    }
    return dataDto;
  }
}
