import * as Joi from 'joi';

// timestamps must be in ISO 8601 format and in UTC timezone
// e.g. 2022-01-01T03:15:00.000Z
const timestamp_regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const DataDtoSchema = Joi.object({
  timestamp: Joi.string().pattern(timestamp_regex).required(),
  country_data: Joi.array()
    .items(
      Joi.object({
        // countryID consists of two uppercase letters, e.g. "GR"
        country_id: Joi.string()
          .pattern(/^[A-Z]{2}$/)
          .required(),

        // resolution_code is one of 'PT15M', 'PT30M', 'PT60M'
        resolution_code: Joi.string()
          .valid('PT15M', 'PT30M', 'PT60M')
          .required(),

        entries: Joi.array()
          .items(
            Joi.object({
              timestamp: Joi.string().pattern(timestamp_regex).required(),
              value: Joi.string()
                .pattern(/^\d+\.\d{1,2}/) // value must be decimal, e.g. 5931.48
                .required(),
            }),
          )
          .required(),
      }).required(),
    )
    .required(),
}).required();
