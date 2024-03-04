import { Controller, Body, HttpCode, Post } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';

@Controller('request-report')
export class AppController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post()
  @HttpCode(204)
  async requestReport(
    @Body() request: { reportType: string; requestedBy: string },
  ): Promise<void> {
    await this.kafkaService.pushMessage(
      request.reportType,
      request.requestedBy,
    );
  }
}
