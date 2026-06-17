export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  transactionDate: Date;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}
