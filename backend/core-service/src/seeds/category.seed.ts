import {CategoryType} from '../enums';
import {CategoryRepository} from '../repositories';

export const DEFAULT_CATEGORIES = [
  // Income
  {name: 'Salary', type: CategoryType.INCOME, isDiscretionary: false},
  {name: 'Bonus', type: CategoryType.INCOME, isDiscretionary: false},
  {name: 'Freelance', type: CategoryType.INCOME, isDiscretionary: false},
  {name: 'Interest', type: CategoryType.INCOME, isDiscretionary: false},
  {name: 'Dividends', type: CategoryType.INCOME, isDiscretionary: false},
  {name: 'Tax Refund', type: CategoryType.INCOME, isDiscretionary: false},
  {name: 'Other Income', type: CategoryType.INCOME, isDiscretionary: false},

  // Essential Expenses
  {name: 'Rent', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Mortgage', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Groceries', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Utilities', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Internet', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Phone', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Insurance', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Healthcare', type: CategoryType.EXPENSE, isDiscretionary: false},
  {name: 'Transportation', type: CategoryType.EXPENSE, isDiscretionary: false},

  // Discretionary Expenses
  {name: 'Dining Out', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Coffee', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Shopping', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Entertainment', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Fitness', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Travel', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Subscriptions', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Personal Care', type: CategoryType.EXPENSE, isDiscretionary: true},
  {
    name: 'Gifts & Donations',
    type: CategoryType.EXPENSE,
    isDiscretionary: true,
  },
  {name: 'Pets', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Education', type: CategoryType.EXPENSE, isDiscretionary: true},
  {name: 'Other Expense', type: CategoryType.EXPENSE, isDiscretionary: true},
];

export async function seedCategories(categoryRepository: CategoryRepository) {
  for (const category of DEFAULT_CATEGORIES) {
    const exists = await categoryRepository.findOne({
      where: {
        name: category.name,
        type: category.type,
      },
    });

    if (!exists) {
      await categoryRepository.create({...category, createdAt: new Date()});
    }
  }
}
