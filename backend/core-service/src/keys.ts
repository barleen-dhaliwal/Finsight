import {BindingKey} from '@loopback/core';
import {Kafka} from 'kafkajs';

export namespace KafkaBindings {
  export const CLIENT = BindingKey.create<Kafka>('kafka.client');
}
