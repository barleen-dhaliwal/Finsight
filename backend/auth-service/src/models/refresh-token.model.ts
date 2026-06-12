import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    postgresql: {
      table: 'refresh_tokens',
    },
  },
})
export class RefreshToken extends Entity {
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
      dataType: 'text',
    },
  })
  token: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'expires_at',
      dataType: 'timestamptz',
    },
  })
  expiresAt: Date;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamptz',
    },
  })
  createdAt?: Date;

  @belongsTo(
    () => User,
    {},
    {
      name: 'user_id',
      postgresql: {
        columnName: 'user_id',
        dataType: 'uuid',
      },
    },
  )
  userId: string;

  constructor(data?: Partial<RefreshToken>) {
    super(data);
  }
}
export interface RefreshTokenRelations {
  // describe navigational properties here
}

export type RefreshTokenWithRelations = RefreshToken & RefreshTokenRelations;
