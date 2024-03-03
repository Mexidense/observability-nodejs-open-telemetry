import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

export class KafkaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly kafka: Kafka,
    private readonly producer: Producer | null = null,
  ) {
    this.producer = this.kafka.producer();
  }

  async pushMessage(message: string): Promise<void> {
    await this.producer
      .send({
        topic: 'administration-service.v1.request-report',
        messages: [{ value: JSON.stringify(message) }],
      })
      .catch((e) => console.error(e.message, e));
  }

  async onModuleDestroy(): Promise<void> {
    return Promise.resolve(this.producer.disconnect());
  }

  async onModuleInit(): Promise<void> {
    return Promise.resolve(this.producer.connect());
  }
}
