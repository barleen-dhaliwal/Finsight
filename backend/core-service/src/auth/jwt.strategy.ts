import {AuthenticationStrategy} from '@loopback/authentication';

import {HttpErrors, Request} from '@loopback/rest';
import {JwtService} from './jwt.service';
import {service} from '@loopback/core';
import {UserProfile} from '@loopback/security';

export class JwtStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @service(JwtService)
    private jwtService: JwtService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpErrors.Unauthorized('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');

    return this.jwtService.verifyToken(token);
  }
}
