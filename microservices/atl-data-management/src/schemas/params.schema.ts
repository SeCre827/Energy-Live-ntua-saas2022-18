import * as Joi from 'joi';

export const ParamsSchema = Joi.object({
  // countryID consists of two uppercase letters, e.g. "GR"
  countryID: Joi.string()
    .pattern(/^[A-Z]{2}$/)
    .required(),
  // dateFrom and dateTo are of the form YYYYMMDD, e.g. "20220101"
  dateFrom: Joi.string()
    .pattern(/^\d{8}$/)
    .required(),
  dateTo: Joi.string()
    .pattern(/^\d{8}$/)
    .required(),
});
