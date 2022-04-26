import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Params } from 'src/input/params.input';
import { Country } from 'src/entities/country.entity';
import { ParamsSchema } from 'src/schemas/params.schema';
import { EntityManager } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class ParamsValidationPipe implements PipeTransform {
  constructor(@InjectEntityManager() private manager: EntityManager) {}

  async transform(value: Params): Promise<Params> {
    // Check if given parameters conform to the parameter schema
    const { error } = ParamsSchema.validate(value);
    if (error) {
      throw new BadRequestException('Invalid parameters');
    }

    // Check if given dates are valid
    const [dateFrom, dateTo] = [
      DateTime.fromISO(value.dateFrom, { zone: 'utc' }),
      DateTime.fromISO(value.dateTo, { zone: 'utc' }).endOf('day'),
    ];
    if (!dateFrom.isValid || !dateTo.isValid || dateFrom > dateTo) {
      throw new BadRequestException('Invalid date');
    }

    // Check if given country exists in the database
    const check = await this.manager.findByIds(Country, [value.countryID]);
    if (check.length === 0) {
      throw new BadRequestException('Invalid country ID');
    }

    // Convert dates from YYYYMMDD format to ISO format and return
    return {
      countryID: value.countryID,
      dateFrom: dateFrom.toISO(),
      dateTo: dateTo.toISO(),
    };
  }
}
