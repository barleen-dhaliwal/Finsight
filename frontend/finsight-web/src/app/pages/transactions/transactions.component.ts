import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatDividerModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  readonly loading = signal(false);
  readonly totalTransactions = signal(0);
  readonly pageSize = signal(20);
  readonly pageIndex = signal(0);

  //   readonly displayedColumns = [
  //     'date',
  //     'description',
  //     'category',
  //     'amount',
  //     'discretionary',
  //     'actions',
  //   ];

  //   readonly filterForm = this.fb.group({
  //     startDate: [''],
  //     endDate: [''],
  //     category: [''],
  //     type: [''],
  //   });

  //   readonly transactionForm = this.fb.group({
  //     amount: ['', [Validators.required, Validators.min(0.01)]],
  //     category: ['', Validators.required],
  //     description: [''],
  //     date: [new Date().toISOString().split('T')[0], Validators.required],
  //     type: ['expense', Validators.required],
  //     discretionary: [false],
  //   });

  //   categories = [
  //     'Food & Dining',
  //     'Transportation',
  //     'Shopping',
  //     'Entertainment',
  //     'Utilities',
  //     'Healthcare',
  //     'Personal Care',
  //     'Vacation',
  //     'Education',
  //     'Other',
  //   ];

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.loadTransactions();
  }

  //   private loadTransactions(): void {
  //     this.loading.set(true);
  //     const filter = this.getFilterValues();
  //     this.transactionService
  //       .listTransactions(filter, this.pageSize(), this.pageIndex() * this.pageSize())
  //       .subscribe({
  //         next: (data) => {
  //           this.transactions.set(data.transactions);
  //           this.totalTransactions.set(data.total);
  //         },
  //         complete: () => this.loading.set(false),
  //       });
  //   }

  //   private getFilterValues() {
  //     const form = this.filterForm.value;
  //     return {
  //       startDate: form.startDate || undefined,
  //       endDate: form.endDate || undefined,
  //       category: form.category || undefined,
  //       type: form.type as 'income' | 'expense' | undefined,
  //     };
  //   }

  //   applyFilters(): void {
  //     this.pageIndex.set(0);
  //     this.loadTransactions();
  //   }

  //   clearFilters(): void {
  //     this.filterForm.reset();
  //     this.applyFilters();
  //   }

  //   onPageChange(event: PageEvent): void {
  //     this.pageIndex.set(event.pageIndex);
  //     this.pageSize.set(event.pageSize);
  //     this.loadTransactions();
  //   }

  //   addTransaction(): void {
  //     if (this.transactionForm.valid) {
  //       const payload = this.transactionForm.value as any;
  //       this.transactionService.createTransaction(payload).subscribe({
  //         next: () => {
  //           this.transactionForm.reset({
  //             date: new Date().toISOString().split('T')[0],
  //             type: 'expense',
  //           });
  //           this.loadTransactions();
  //         },
  //       });
  //     }
  //   }

  //   deleteTransaction(id: string): void {
  //     if (confirm('Are you sure you want to delete this transaction?')) {
  //       this.transactionService.deleteTransaction(id).subscribe({
  //         next: () => this.loadTransactions(),
  //       });
  //     }
  //   }

  //   formatCurrency(value: number): string {
  //     return new Intl.NumberFormat('en-US', {
  //       style: 'currency',
  //       currency: 'USD',
  //     }).format(value);
  //   }

  //   formatDate(date: string): string {
  //     return new Date(date).toLocaleDateString('en-US', {
  //       month: 'short',
  //       day: 'numeric',
  //       year: 'numeric',
  //     });
  //   }
}
