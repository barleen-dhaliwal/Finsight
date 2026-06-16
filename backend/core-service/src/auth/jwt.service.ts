import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import jwt from 'jsonwebtoken';

export class JwtService {
  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserProfile;
      return {
        [securityId]: decoded.sub,
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      };
    } catch {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
}
