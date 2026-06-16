import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';

@model({
  settings: {
    postgresql: {
      table: 'transactions',
    },
  },
})
export class Transaction extends Entity {
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
      columnName: 'user_id',
      dataType: 'uuid',
    },
  })
  userId: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'decimal',
      precision: 12,
      scale: 2,
    },
  })
  amount: number;

  @belongsTo(
    () => Category,
    {keyFrom: 'categoryId', keyTo: 'id'},
    {
      name: 'category_id',
      postgresql: {
        columnName: 'category_id',
        dataType: 'uuid',
      },
    },
  )
  categoryId: string;
  @property({
    type: 'string',
  })
  description?: string;

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

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
