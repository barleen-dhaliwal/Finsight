import {injectable, BindingScope, Provider} from '@loopback/core';
import {Kafka} from 'kafkajs';

@injectable({scope: BindingScope.SINGLETON})
export class KafkaProvider implements Provider<Kafka> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    const brokers = process.env.KAFKA_BROKERS?.split(',') ?? ['localhost:9092'];
    const clientId =
      process.env.KAFKA_CLIENT_ID ?? 'finsight-ai-provider-service';

    return new Kafka({
      clientId,
      brokers,
    });
  }
}
