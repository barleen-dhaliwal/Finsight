import {Entity, model, property} from '@loopback/repository';
import {InsightStatus, InsightType, InsightSeverity} from '../enums';

@model({
  settings: {
    postgresql: {
      table: 'insights',
    },
  },
})
export class Insight extends Entity {
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
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'varchar',
      length: 150,
    },
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'text',
    },
  })
  content: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'smallint',
    },
  })
  type: InsightType;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'smallint',
    },
  })
  severity: InsightSeverity;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'smallint',
    },
  })
  status: InsightStatus;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'generated_at',
      dataType: 'timestamptz',
    },
  })
  generatedAt: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamptz',
    },
  })
  createdAt?: Date;

  constructor(data?: Partial<Insight>) {
    super(data);
  }
}

export interface InsightRelations {}

export type InsightWithRelations = Insight & InsightRelations;
