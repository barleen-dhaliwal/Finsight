import {Entity, model, property} from '@loopback/repository';
import {InsightGenerationStatus} from '../enums';

@model({
  settings: {
    postgresql: {
      table: 'insight_generations',
    },
  },
})
export class InsightGeneration extends Entity {
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
  })
  year: number;

  @property({
    type: 'number',
    required: true,
  })
  month: number;

  @property({
    type: 'number',
    required: true,
    default: InsightGenerationStatus.Pending,
    postgresql: {
      dataType: 'smallint',
    },
  })
  status: InsightGenerationStatus;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'error_message',
      dataType: 'text',
    },
  })
  errorMessage?: string;

  @property({
    type: 'date',
    default: () => new Date(),
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamptz',
    },
  })
  createdAt?: Date;

  constructor(data?: Partial<InsightGeneration>) {
    super(data);
  }
}

export interface InsightGenerationRelations {}

export type InsightGenerationWithRelations = InsightGeneration &
  InsightGenerationRelations;
