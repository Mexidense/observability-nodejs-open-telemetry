import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { RequestReportDto } from 'src/request-report.dto';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly kafka: Kafka,
    private readonly producer: Producer | null = null,
  ) {
    this.producer = this.kafka.producer();
  }

  async pushMessage(requestReport: RequestReportDto): Promise<void> {
    console.log(
      `[${new Date().toISOString()}][Kafka] Pusing message...`,
      requestReport,
    );

    await this.producer
      .send({
        topic: 'administration-service.v1.request-report',
        messages: [{ value: JSON.stringify(requestReport) }],
      })
      .catch((e) => console.error(e.message, e));
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();

    return Promise.resolve();
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();

    return Promise.resolve();
  }
}
