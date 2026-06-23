import {BindingScope, inject, injectable} from '@loopback/core';
import {Kafka, Producer} from 'kafkajs';
import {GeneratedInsightsDto} from '../models';
import {KAFKA_TOPICS} from '../constants/kafka-topics';
import {KafkaBindings} from '../keys';

@injectable({scope: BindingScope.SINGLETON})
export class InsightProducerService {
  private readonly producer: Producer;
  private readonly producerReady: Promise<void>;

  constructor(
    @inject(KafkaBindings.CLIENT)
    private kafka: Kafka,
  ) {
    this.producer = this.kafka.producer();
    this.producerReady = this.producer.connect();
  }

  async publishGeneratedInsights(dto: GeneratedInsightsDto): Promise<void> {
    await this.producerReady;

    await this.producer.send({
      topic: KAFKA_TOPICS.INSIGHT_RESULTS,
      messages: [
        {
          key: dto.userId,
          value: JSON.stringify(dto),
        },
      ],
    });
  }

  async stop(): Promise<void> {
    await this.producer.disconnect();
  }
}
