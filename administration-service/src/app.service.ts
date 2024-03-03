import { KafkaService } from './kafka/kafka.service';

export class AppService {
  constructor(private readonly kafkaService: KafkaService) {}

  async getHello(message: string): Promise<void> {
    await this.kafkaService.pushMessage(message);
  }
}
