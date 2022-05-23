import * as Joi from 'joi';

// timestamps must be in ISO 8601 format and in UTC timezone
// e.g. 2022-01-01T03:15:00.000Z
const timestamp_regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const email_regex = /^\S+@\S+$/;

export const JwtPayloadSchema = Joi.object({
  email: Joi.string().pattern(email_regex).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  licence_expiration: Joi.string().pattern(timestamp_regex).required(),
  last_login: Joi.string().pattern(timestamp_regex).required(),
  exp: Joi.number().min(1000000000).max(9999999999).required(),
  iat: Joi.number().min(1000000000).max(9999999999).required(),
}).required();
