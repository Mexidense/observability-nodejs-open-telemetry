import { Consumer, Kafka } from 'kafkajs';

export class KafkaConsumerService {
  constructor(
    private readonly kafka: Kafka,
    public readonly consumer: Consumer | null = null,
  ) {
    this.consumer = this.kafka.consumer({
      groupId: '108fbafc-50f7-4960-b9aa-e8acd44fecc2',
    });
  }
}
