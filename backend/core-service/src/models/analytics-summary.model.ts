import {model, property} from '@loopback/repository';

@model()
export class ExpenseCategorySummary {
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
}

@model()
export class AnalyticsSummary {
  @property({type: 'number', required: true})
  totalIncome: number;

  @property({type: 'number', required: true})
  totalExpense: number;

  @property({type: 'number', required: true})
  netCashflow: number;

  @property({type: 'number', required: true})
  transactionCount: number;

  @property.array(ExpenseCategorySummary)
  topExpenseCategories: ExpenseCategorySummary[];
}
