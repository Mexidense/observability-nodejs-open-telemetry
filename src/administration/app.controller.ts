import { Controller, Body, HttpCode, Post } from '@nestjs/common';
import { KafkaProducerService } from './kafka/kafka-producer.service';

@Controller('request-report')
export class AppController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  @HttpCode(204)
  async requestReport(
    @Body() request: { reportType: string; requestedBy: string },
  ): Promise<void> {
    await this.kafkaProducerService.pushMessage(
      request.reportType,
      request.requestedBy,
    );
  }
}
