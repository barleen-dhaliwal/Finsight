import {BindingKey} from '@loopback/core';
import {Kafka} from 'kafkajs';
import OpenAI from 'openai';

export namespace KafkaBindings {
  export const CLIENT = BindingKey.create<Kafka>('kafka.client');
}

export namespace AIBindings {
  export const OPENAI_CLIENT = BindingKey.create<OpenAI>(
    'services.openai.client',
  );
}
