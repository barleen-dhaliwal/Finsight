export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  email: string;
  name: string;
}
