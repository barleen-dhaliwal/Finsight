import {Model, model, property} from '@loopback/repository';
import {InsightType, InsightSeverity} from '../enums';

@model()
export class GeneratedInsightDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'number',
    required: true,
  })
  type: InsightType;

  @property({
    type: 'number',
    required: true,
  })
  severity: InsightSeverity;
}

@model()
export class GeneratedInsightsDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  requestId: string;

  @property({
    type: 'string',
    required: true,
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

  @property.array(GeneratedInsightDto)
  insights: GeneratedInsightDto[];
}
