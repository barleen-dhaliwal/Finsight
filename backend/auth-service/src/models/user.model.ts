import {Entity, model, property, hasMany} from '@loopback/repository';
import {RefreshToken} from './refresh-token.model';

@model({
  settings: {
    postgresql: {
      table: 'users',
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    postgresql: {
      dataType: 'uuid',
      defaultFn: 'gen_random_uuid',
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'email',
      dataType: 'varchar',
      length: 255,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'password_hash',
      dataType: 'varchar',
      length: 255,
    },
  })
  passwordHash: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'name',
      dataType: 'varchar',
      length: 255,
    },
  })
  name: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamptz',
    },
  })
  createdAt?: Date;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updated_at',
      dataType: 'timestamptz',
    },
  })
  updatedAt?: Date;

  @hasMany(() => RefreshToken, {keyTo: 'userId'})
  refreshTokens?: RefreshToken[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
