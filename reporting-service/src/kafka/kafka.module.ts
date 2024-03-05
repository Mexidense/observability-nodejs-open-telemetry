import { Kafka } from 'kafkajs';
import { DynamicModule, Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';

export type KafkaConfig = {
  clientId: string;
  brokers: string[];
};

@Module({})
export class KafkaModule {
  static register(kafkaConfig: KafkaConfig): DynamicModule {
    return {
      global: true,
      module: KafkaModule,
      providers: [
        {
          provide: Kafka,
          useFactory: () =>
            new Kafka({
              clientId: kafkaConfig.clientId,
              brokers: kafkaConfig.brokers,
            }),
        },
        {
          provide: KafkaConsumerService,
          useFactory: (kafka: Kafka) => new KafkaConsumerService(kafka),
          inject: [Kafka],
        },
      ],
      exports: [KafkaConsumerService],
    };
  }
}
