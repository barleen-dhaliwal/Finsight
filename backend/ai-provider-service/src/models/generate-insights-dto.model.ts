import {Model, model, property} from '@loopback/repository';
import {AnalyticsSummary} from './analytics-summary.model';

@model()
export class MonthlyAnalyticsSummary extends AnalyticsSummary {
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
}

@model()
export class GenerateInsightsDto extends Model {
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
    type: MonthlyAnalyticsSummary,
    required: true,
  })
  currentMonth: MonthlyAnalyticsSummary;

  @property.array(MonthlyAnalyticsSummary)
  previousMonths: MonthlyAnalyticsSummary[];
}
