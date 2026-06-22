import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {TransactionRepository} from '../repositories';
import {CategoryType} from '../enums';
import {Category} from '../models';

@injectable()
export class AnalyticsService {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) {}

  async getMonthlySummary(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: [
        {
          relation: 'category',
        },
      ],
    });
    let totalIncome = 0;
    let totalExpense = 0;

    const categoryTotals = new Map<string, number>();

    for (const transaction of transactions) {
      const category = transaction.category as Category;
      const amount = Number(transaction.amount);
      if (category.type === CategoryType.INCOME) {
        totalIncome += amount;
      } else {
        totalExpense += amount;

        const current = categoryTotals.get(category.name) ?? 0;

        categoryTotals.set(category.name, current + amount);
      }
    }

    const topExpenseCategories = [...categoryTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
      }));

    return {
      totalIncome,
      totalExpense,
      netCashflow: totalIncome - totalExpense,
      transactionCount: transactions.length,
      topExpenseCategories,
    };
  }
}
