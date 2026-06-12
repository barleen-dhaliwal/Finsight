import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';
import {RefreshTokenRepository, UserRepository} from '../repositories';
import jwt from 'jsonwebtoken';
import {User} from '../models';
import {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  JWT_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY_IN_SECONDS,
  JWT_REFRESH_TOKEN_EXPIRY_IN_SECONDS,
  JwtPayload,
  RefreshRequest,
  ROUNDS,
} from '../types/auth.types';
import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';

@injectable()
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(
    body: RegisterRequest,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>> {
    const existingUser = await this.userRepository.findOne({
      where: {email: body.email.toLowerCase()},
    });
    if (existingUser) {
      throw new HttpErrors.Conflict('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(body.password, ROUNDS);

    const user = await this.userRepository.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(body: LoginRequest): Promise<TokenResponse> {
    const user = await this.userRepository.findOne({
      where: {email: body.email.toLowerCase()},
    });
    if (!user) throw new HttpErrors.Unauthorized('Invalid credentials');

    const match = await bcrypt.compare(body.password, user.passwordHash);
    if (!match) throw new HttpErrors.Unauthorized('Invalid credentials');

    const payload = {
      sub: user.id!,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + JWT_REFRESH_TOKEN_EXPIRY_IN_SECONDS * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }

  async logout(body: RefreshRequest) {
    const token = body.refreshToken;
    return this.refreshTokenRepository.deleteAll({token});
  }

  async refresh(body: RefreshRequest): Promise<TokenResponse> {
    try {
      this.verifyToken(body.refreshToken);
    } catch (err) {
      throw new HttpErrors.Unauthorized('Invalid refresh token');
    }

    const storedRefreshToken = await this.refreshTokenRepository.findOne({
      where: {token: body.refreshToken},
    });

    if (!storedRefreshToken) {
      throw new HttpErrors.Unauthorized('Refresh token revoked or unknown');
    }

    // rotate refresh token
    const user = await this.userRepository.findById(storedRefreshToken.userId);
    const jwtPayload: JwtPayload = {
      sub: user.id!,
      email: user.email,
      name: user.name,
    };

    const newAccess = this.generateAccessToken(jwtPayload);
    const newRefresh = this.generateRefreshToken(jwtPayload);

    await this.refreshTokenRepository.deleteById(storedRefreshToken.id!);
    await this.refreshTokenRepository.create({
      token: newRefresh,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + JWT_REFRESH_TOKEN_EXPIRY_IN_SECONDS * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
    });

    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
      tokenType: 'Bearer',
    };
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY_IN_SECONDS,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY_IN_SECONDS,
    });
  }

  verifyToken(token: string): JwtPayload & jwt.JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & jwt.JwtPayload;
  }
}
