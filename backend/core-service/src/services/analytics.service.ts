import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {TransactionRepository} from '../repositories';
import {CategoryType} from '../enums';
import {AnalyticsSummary, Category} from '../models';

@injectable()
export class AnalyticsService {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) {}

  async getMonthlySummary(
    userId: string,
    year: number,
    month: number,
  ): Promise<AnalyticsSummary> {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const transactions = await this.transactionRepository.find({
      where: {
        and: [
          {userId},
          {transactionDate: {gte: startDate}},
          {transactionDate: {lt: endDate}},
        ],
      },
      include: [
        {
          relation: 'category',
        },
      ],
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let discretionaryExpense = 0;
    let essentialExpense = 0;

    const categoryTotals = new Map<
      string,
      {
        amount: number;
        isDiscretionary: boolean;
      }
    >();

    for (const transaction of transactions) {
      const category = transaction.category as Category;
      const amount = Number(transaction.amount);

      if (category.type === CategoryType.INCOME) {
        totalIncome += amount;
        continue;
      }

      totalExpense += amount;

      const isDiscretionary = category.isDiscretionary ?? true;

      if (isDiscretionary) {
        discretionaryExpense += amount;
      } else {
        essentialExpense += amount;
      }

      const current = categoryTotals.get(category.name);

      categoryTotals.set(category.name, {
        amount: (current?.amount ?? 0) + amount,
        isDiscretionary,
      });
    }

    const topExpenseCategories = [...categoryTotals.entries()]
      .sort((a, b) => b[1].amount - a[1].amount)
      .slice(0, 5)
      .map(([category, summary]) => ({
        category,
        amount: summary.amount,
        isDiscretionary: summary.isDiscretionary,
      }));

    return {
      totalIncome,
      totalExpense,
      netCashflow: totalIncome - totalExpense,
      transactionCount: transactions.length,
      discretionaryExpense,
      essentialExpense,
      topExpenseCategories,
    } as AnalyticsSummary;
  }
}
