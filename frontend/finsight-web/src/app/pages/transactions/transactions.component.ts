import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { CategoryService } from '../../services/category.service';
import { Category, CategoryType } from '../../models/category.model';
import { forkJoin, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  categoryMap = signal<Record<string, Category>>({});
  protected readonly CategoryType = CategoryType;

  readonly loading = signal(false);
  readonly totalTransactions = signal(0);
  readonly pageSize = signal(5);
  readonly pageIndex = signal(0);

  readonly displayedColumns = [
    'transactionDate',
    'description',
    'categoryId',
    'amount',
    'type',
    'actions',
  ];

  readonly filterForm = this.fb.group({
    startDate: this.fb.control<string>(''),
    endDate: this.fb.control<string>(''),
    category: this.fb.control<string>(''),
    type: this.fb.control<CategoryType | null>(null),
  });

  readonly transactionForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: ['', Validators.required],
    description: [''],
    transactionDate: [new Date(), Validators.required],
  });

  selectedType = toSignal(
    this.filterForm.controls.type.valueChanges.pipe(startWith(this.filterForm.controls.type.value))
  );

  filteredCategories = computed(() => {
    const type = this.selectedType();
    if (type === null || type === undefined) {
      return this.categories();
    }
    return this.categories().filter((category) => category.type === type);
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
    this.filterForm.controls.type.valueChanges.subscribe(() => {
      this.filterForm.controls.category.setValue(null);
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe((c) => {
      this.categories.set(c);
      const categoryMap: Record<string, Category> = {};
      c.forEach((category) => {
        categoryMap[category.id] = category;
      });
      this.categoryMap.set(categoryMap);
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categoryMap()[categoryId];
    return category ? category.name : 'Unknown';
  }

  getCategoryType(categoryId: string): string {
    const category = this.categoryMap()[categoryId];
    return category.type === CategoryType.INCOME ? 'Income' : 'Expense';
  }

  private getFilters() {
    const formValue = this.filterForm.getRawValue();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (formValue.startDate && formValue.endDate) {
      const start = new Date(formValue.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(formValue.endDate);
      end.setHours(23, 59, 59, 999);

      where['transactionDate'] = {
        between: [start.toISOString(), end.toISOString()],
      };
    } else if (formValue.startDate) {
      const start = new Date(formValue.startDate);
      start.setHours(0, 0, 0, 0);
      where['transactionDate'] = {
        gte: start.toISOString(),
      };
    } else if (formValue.endDate) {
      const end = new Date(formValue.endDate);
      end.setHours(23, 59, 59, 999);
      where['transactionDate'] = {
        lte: end.toISOString(),
      };
    }

    if (formValue.category) {
      where['categoryId'] = formValue.category;
    } else if (formValue.type !== null) {
      const categoryIds = this.categories()
        .filter((category) => category.type === formValue.type)
        .map((category) => category.id);
      where['categoryId'] = {
        inq: categoryIds,
      };
    }

    return where;
  }

  private loadTransactions(): void {
    this.loading.set(true);
    const limit = this.pageSize();
    const skip = this.pageIndex() * this.pageSize();
    const where = this.getFilters();
    forkJoin({
      transactions: this.transactionService.getTransactions(limit, skip, where),
      count: this.transactionService.getTransactionsCount(where),
    }).subscribe({
      next: ({ transactions, count }) => {
        this.transactions.set(transactions);
        this.totalTransactions.set(count.count);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    this.pageIndex.set(0);
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTransactions();
  }

  addTransaction(): void {
    if (this.transactionForm.valid) {
      const payload = this.transactionForm.value;
      if (!payload.description?.trim()) {
        delete payload.description;
      }
      this.transactionService
        .addTransaction(payload as Omit<Transaction, 'id' | 'createdAt'>)
        .subscribe({
          next: (_) => {
            this.transactionForm.reset();
            this.loadTransactions();
          },
        });
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => this.loadTransactions(),
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
