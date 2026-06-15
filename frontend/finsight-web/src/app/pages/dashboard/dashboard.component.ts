import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  // readonly summary = signal<AnalyticsSummary | null>(null);
  readonly summary = signal(null);

  // readonly recentTransactions = signal<Transaction[]>([]);
  readonly recentTransactions = signal([]);

  // readonly categoryBreakdown = signal<CategoryBreakdown[]>([]);

  readonly categoryBreakdown = signal([]);
  // readonly featuredInsight = signal<Insight | null>(null);

  readonly featuredInsight = signal(null);
  readonly loading = signal(true);

  readonly displayedColumns = ['date', 'description', 'category', 'amount'];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    // Load all data in parallel
    // this.transactionService.getSummary().subscribe({
    //   next: (data) => this.summary.set(data),
    // });

    // this.transactionService.getRecentTransactions(10).subscribe({
    //   next: (data) => this.recentTransactions.set(data),
    // });

    // this.transactionService.getCategoryBreakdown().subscribe({
    //   next: (data) => this.categoryBreakdown.set(data),
    // });

    // this.insightService.getLatestInsight().subscribe({
    //   next: (data) => this.featuredInsight.set(data),
    //   complete: () => this.loading.set(false),
    // });
  }

  refreshInsights(): void {
    // this.insightService.triggerRefresh().subscribe({
    //   next: () => {
    //     this.insightService.getLatestInsight().subscribe({
    //       next: (data) => this.featuredInsight.set(data),
    //     });
    //   },
    // });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
