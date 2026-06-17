import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { Count } from '../models/count.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly http = inject(HttpClient);

  getTransactions(limit: number, skip: number, where: object = {}): Observable<Transaction[]> {
    const filter = {
      where,
      limit,
      skip,
      order: ['transactionDate DESC'],
    };
    return this.http.get<Transaction[]>(`${environment.coreServiceUrl}/transactions`, {
      params: {
        filter: JSON.stringify(filter),
      },
    });
  }

  getTransactionsCount(where: object = {}): Observable<Count> {
    return this.http.get<Count>(`${environment.coreServiceUrl}/transactions/count`, {
      params: {
        where: JSON.stringify(where),
      },
    });
  }

  addTransaction(payload: Omit<Transaction, 'id' | 'createdAt'>): Observable<Transaction> {
    return this.http.post<Transaction>(`${environment.coreServiceUrl}/transactions`, payload);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.coreServiceUrl}/transactions/${id}`);
  }
}
