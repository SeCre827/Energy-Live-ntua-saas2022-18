import * as Joi from 'joi';

// Email address must contain '@'
const email_regex = /^\S+@\S+$/;

// timestamps must be in ISO 8601 format and in UTC timezone
// e.g. 2022-01-01T03:15:00.000Z
const timestamp_regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// For issue and expiration times, allow only 10-digit timestamps
const time_min = 1000000000;
const time_max = 9999999999;

export const JwtPayloadSchema = Joi.object({
  email: Joi.string().pattern(email_regex).required(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().allow(null).optional(),
  licence_expiration: Joi.string().pattern(timestamp_regex).required(),
  last_login: Joi.string().pattern(timestamp_regex).allow(null).required(),
  exp: Joi.number().min(time_min).max(time_max).required(),
  iat: Joi.number().min(time_min).max(time_max).required(),
}).required();
