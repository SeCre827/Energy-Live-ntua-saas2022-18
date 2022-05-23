import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Country } from 'src/entities/country.entity';
import { Params } from 'src/input/params.input';
import { ParamsSchema } from 'src/schemas/params.schema';
import { EntityManager } from 'typeorm';

export async function validateParams(params: Params, manager: EntityManager) {
  // Check if given parameters conform to the parameter schema
  const { error } = ParamsSchema.validate(params);
  if (error) {
    throw new BadRequestException('Invalid parameters');
  }

  // Check if given dates are valid
  const [dateFrom, dateTo] = [
    DateTime.fromISO(params.dateFrom, { zone: 'utc' }),
    DateTime.fromISO(params.dateTo, { zone: 'utc' }).endOf('day'),
  ];
  if (!dateFrom.isValid || !dateTo.isValid || dateFrom > dateTo) {
    throw new BadRequestException('Invalid date(s)');
  }

  // Check if given country exists in the database
  const check = await manager.findByIds(Country, [params.countryID]);
  if (check.length === 0) {
    throw new BadRequestException('Invalid country ID');
  }
}
