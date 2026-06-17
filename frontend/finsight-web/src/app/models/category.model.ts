export enum CategoryType {
  INCOME,
  EXPENSE,
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  isDiscretionary?: boolean;
  createdAt: string;
}
