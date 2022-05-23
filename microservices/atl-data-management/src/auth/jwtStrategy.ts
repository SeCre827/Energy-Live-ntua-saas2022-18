import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { DateTime } from 'luxon';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadSchema } from 'src/schemas/jwtPayload.schema';
import { JwtPayload } from './jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    // Check that payload conforms to the appropriate schema
    const { error } = JwtPayloadSchema.validate(payload);
    if (error) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    // Check that the licence has not expired
    const expirationDt = DateTime.fromISO(payload.licence_expiration);
    if (!expirationDt || expirationDt < DateTime.now()) {
      throw new UnauthorizedException('Licence has expired');
    }

    // JWT successfully validated; continue with request handling
    return true;
  }
}
