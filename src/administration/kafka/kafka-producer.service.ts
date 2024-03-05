import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { RequestReportDto } from 'src/request-report.dto';

@Injectable()
export class KafkaProducerService {
  constructor(
    private readonly kafka: Kafka,
    public readonly producer: Producer | null = null,
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
}
