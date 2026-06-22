import {Model, model, property} from '@loopback/repository';

@model()
export class ExpenseCategorySummary extends Model {
  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'number',
    required: true,
  })
  isDiscretionary: boolean;
}

@model()
export class AnalyticsSummary extends Model {
  @property({type: 'number', required: true})
  totalIncome: number;

  @property({type: 'number', required: true})
  totalExpense: number;

  @property({type: 'number', required: true})
  netCashflow: number;

  @property({type: 'number', required: true})
  transactionCount: number;

  @property({type: 'number', required: true})
  discretionaryExpense: number;

  @property({type: 'number', required: true})
  essentialExpense: number;

  @property.array(ExpenseCategorySummary)
  topExpenseCategories: ExpenseCategorySummary[];
}
