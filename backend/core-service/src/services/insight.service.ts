import {BindingScope, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Kafka, Producer} from 'kafkajs';
import {InsightGenerationStatus} from '../enums';
import {KafkaBindings} from '../keys';
import {GenerateInsightsDto, MonthlyAnalyticsSummary} from '../models';
import {InsightGenerationRepository} from '../repositories';
import {AnalyticsService} from './analytics.service';
import {KafkaTopics} from '../constants/kafka-topics';

@injectable({scope: BindingScope.SINGLETON})
export class InsightService {
  private readonly producer: Producer;
  private readonly producerReady: Promise<void>;

  constructor(
    @inject(KafkaBindings.CLIENT)
    private kafka: Kafka,

    @repository(InsightGenerationRepository)
    private insightGenerationRepository: InsightGenerationRepository,

    @service(AnalyticsService)
    private analyticsService: AnalyticsService,
  ) {
    this.producer = this.kafka.producer();
    this.producerReady = this.producer.connect();
  }

  async generateInsights(userId: string, year: number, month: number) {
    await this.producerReady;

    const insightGeneration = await this.insightGenerationRepository.create({
      userId,
      year,
      month,
      status: InsightGenerationStatus.Pending,
      createdAt: new Date(),
    });

    const currentMonthSummary = await this.analyticsService.getMonthlySummary(
      userId,
      year,
      month,
    );

    const currentMonth = {
      year,
      month,
      ...currentMonthSummary,
    } as MonthlyAnalyticsSummary;

    const previousMonths = await this.getPreviousMonthlySummaries(
      userId,
      year,
      month,
      3,
    );

    const payload = {
      requestId: insightGeneration.id!,
      userId,
      currentMonth,
      previousMonths,
    } as GenerateInsightsDto;

    await this.producer.send({
      topic: KafkaTopics.INSIGHT_REQUESTS,
      messages: [
        {
          key: userId,
          value: JSON.stringify(payload),
        },
      ],
    });

    return insightGeneration;
  }

  private async getPreviousMonthlySummaries(
    userId: string,
    year: number,
    month: number,
    count: number,
  ) {
    const summaryPromises = [];

    for (let i = 1; i <= count; i++) {
      const date = new Date(year, month - 1 - i, 1);
      const summaryYear = date.getFullYear();
      const summaryMonth = date.getMonth() + 1;

      summaryPromises.push(
        this.analyticsService
          .getMonthlySummary(userId, summaryYear, summaryMonth)
          .then(summary => ({
            year: summaryYear,
            month: summaryMonth,
            ...summary,
          })),
      );
    }

    return Promise.all(summaryPromises);
  }
}
