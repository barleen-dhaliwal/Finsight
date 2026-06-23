import {lifeCycleObserver, LifeCycleObserver, service} from '@loopback/core';
import {InsightConsumerService} from '../services/insight-consumer.service';

@lifeCycleObserver('kafka')
export class KafkaConsumerObserver implements LifeCycleObserver {
  constructor(
    @service(InsightConsumerService)
    private insightConsumer: InsightConsumerService,
  ) {}

  async start(): Promise<void> {
    await this.insightConsumer.start();
  }

  async stop(): Promise<void> {
    await this.insightConsumer.stop();
  }
}
