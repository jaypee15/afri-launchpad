import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ErrorHelper } from 'src/core/helpers/error.utils';
import { SecretsService } from 'src/global/secrets/service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private secretsService:SecretsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretsService.jwtSecret.JWT_SECRET,  // Same secret used by NextAuth
    });
  }

  async validate(payload: any) {

    if (!payload) {
        ErrorHelper.UnauthorizedException('You are not Authorized to view this route')
      }
    // additional validation logic
    return { userId: payload.sub, email: payload.email };
  }
}