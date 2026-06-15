import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent implements OnInit {
  //   readonly insights = signal<Insight[]>([]);
  readonly loading = signal(false);
  readonly refreshing = signal(false);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    //   this.loadInsights();
  }

  //   private loadInsights(): void {
  //     this.loading.set(true);
  //     this.insightService.getInsights(20, 0).subscribe({
  //       next: (data) => {
  //         this.insights.set(data.insights);
  //       },
  //       complete: () => this.loading.set(false),
  //     });
  //   }

  //   refreshInsights(): void {
  //     this.refreshing.set(true);
  //     this.insightService.triggerRefresh().subscribe({
  //       next: () => {
  //         this.loadInsights();
  //       },
  //       complete: () => this.refreshing.set(false),
  //     });
  //   }

  //   formatDate(date: string): string {
  //     return new Date(date).toLocaleDateString('en-US', {
  //       weekday: 'long',
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });
  //   }
}
