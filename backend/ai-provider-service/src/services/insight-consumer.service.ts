import {injectable, BindingScope, inject, service} from '@loopback/core';
import {Kafka, Consumer} from 'kafkajs';
import {KAFKA_CONSUMER_GROUPS, KAFKA_TOPICS} from '../constants/kafka-topics';
import {OpenAIService} from './open-ai.service';
import {GenerateInsightsDto} from '../models';
import {KafkaBindings} from '../keys';
import {InsightProducerService} from './insight-producer.service';

@injectable({scope: BindingScope.SINGLETON})
export class InsightConsumerService {
  private consumer: Consumer;

  constructor(
    @inject(KafkaBindings.CLIENT)
    private kafka: Kafka,
    @service(OpenAIService)
    private openAIService: OpenAIService,
    @service(InsightProducerService)
    private insightProducerService: InsightProducerService,
  ) {}

  async start() {
    this.consumer = this.kafka.consumer({
      groupId: KAFKA_CONSUMER_GROUPS.AI_PROVIDER,
    });

    await this.consumer.connect();

    await this.consumer.subscribe({
      topic: KAFKA_TOPICS.INSIGHT_REQUESTS,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        const value = message.value?.toString();
        if (!value) return;
        const payload = JSON.parse(value) as GenerateInsightsDto;
        const generatedInsights =
          await this.openAIService.generateInsights(payload);
        await this.insightProducerService.publishGeneratedInsights(
          generatedInsights,
        );
      },
    });
  }

  async stop() {
    await this.consumer?.disconnect();
  }
}
