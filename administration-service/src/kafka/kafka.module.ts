import { Kafka } from 'kafkajs';
import { DynamicModule, Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';

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
          provide: KafkaProducerService,
          useFactory: (kafka: Kafka) => new KafkaProducerService(kafka),
          inject: [Kafka],
        },
      ],
      exports: [KafkaProducerService],
    };
  }
}
