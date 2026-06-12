import {ResponseObject} from '@loopback/rest';

//15min for access token, 7d for refresh token
const DEFAULT_ACCESS_EXPIRES_IN_SECONDS = 15 * 60;
const DEFAULT_REFRESH_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;
export const DEFAULT_ROUNDS = 10;

export const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? DEFAULT_ROUNDS);

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_ACCESS_TOKEN_EXPIRY_IN_SECONDS = Number(
  process.env.JWT_ACCESS_TOKEN_EXPIRY_IN_SECONDS ??
    DEFAULT_ACCESS_EXPIRES_IN_SECONDS,
);
export const JWT_REFRESH_TOKEN_EXPIRY_IN_SECONDS = Number(
  process.env.JWT_REFRESH_TOKEN_EXPIRY_IN_SECONDS ??
    DEFAULT_REFRESH_EXPIRES_IN_SECONDS,
);

export const REGISTER_RESPONSE: ResponseObject = {
  description: 'User registration response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'RegisterResponse',
        properties: {
          id: {type: 'string'},
          name: {type: 'string'},
          email: {type: 'string'},
          createdAt: {type: 'string', format: 'date-time'},
        },
      },
    },
  },
};

export const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login response containing access and refresh tokens',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          accessToken: {type: 'string'},
          refreshToken: {type: 'string'},
          tokenType: {type: 'string'},
          expiresIn: {type: 'number'},
        },
      },
    },
  },
};

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}
