import {post, requestBody, response} from '@loopback/rest';
import {User} from '../models';
import {
  REGISTER_RESPONSE,
  RegisterRequest,
  LoginRequest,
  LOGIN_RESPONSE,
  TokenResponse,
  RefreshRequest,
} from '../types/auth.types';
import {UserService} from '../services/user.service';
import {service} from '@loopback/core';

export class AuthController {
  constructor(@service(UserService) public userService: UserService) {}

  @post('/auth/register')
  @response(201, REGISTER_RESPONSE)
  async register(
    @requestBody({
      description: 'Register a new user account',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
              name: {type: 'string'},
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 8},
            },
          },
        },
      },
    })
    body: RegisterRequest,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>> {
    return this.userService.register(body);
  }

  @post('/auth/login')
  @response(200, LOGIN_RESPONSE)
  async login(
    @requestBody({
      description: 'Login with email and password',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 8},
            },
          },
        },
      },
    })
    body: LoginRequest,
  ): Promise<TokenResponse> {
    return this.userService.login(body);
  }

  @post('/auth/refresh')
  @response(200, LOGIN_RESPONSE)
  async refresh(
    @requestBody({
      description: 'Exchange a refresh token for a new access token',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: {type: 'string'},
            },
          },
        },
      },
    })
    body: RefreshRequest,
  ): Promise<TokenResponse> {
    return this.userService.refresh(body);
  }

  @post('/auth/logout')
  @response(204)
  async logout(
    @requestBody({
      description: 'Revoke a refresh token',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['refreshToken'],
            properties: {refreshToken: {type: 'string'}},
          },
        },
      },
    })
    body: RefreshRequest,
  ): Promise<void> {
    await this.userService.logout(body);
  }
}
