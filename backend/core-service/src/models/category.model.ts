import {Entity, model, property, hasMany} from '@loopback/repository';
import {CategoryType} from '../enums';
import {Transaction} from './transaction.model';

@model({
  settings: {
    postgresql: {
      table: 'categories',
    },
  },
})
export class Category extends Entity {
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
      dataType: 'varchar',
      length: 100,
    },
  })
  name: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'smallint',
    },
  })
  type: CategoryType;

  @property({
    type: 'boolean',
    default: true,
    postgresql: {
      columnName: 'is_discretionary',
      dataType: 'boolean',
    },
  })
  isDiscretionary?: boolean;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamptz',
    },
  })
  createdAt?: Date;

  @hasMany(() => Transaction, {keyTo: 'categoryId'})
  transactions?: Transaction[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
