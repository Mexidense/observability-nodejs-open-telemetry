import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';

export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly kafka: Kafka,
    private readonly consumer: Consumer | null = null,
  ) {
    this.consumer = this.kafka.consumer({
      groupId: '108fbafc-50f7-4960-b9aa-e8acd44fecc2',
    });
  }

  async consumeMessage(): Promise<void> {}

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'administration-service.v1.request-report',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (params: EachMessagePayload) => {
        console.log(JSON.parse(params.message.value.toString()));
      },
    });

    return Promise.resolve();
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();

    return Promise.resolve();
  }
}
