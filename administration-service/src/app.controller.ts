import { Controller, Body, HttpCode, Post } from '@nestjs/common';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import { RequestReportDto } from 'src/_request-report.dto';

@Controller('request-report')
export class AppController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  @HttpCode(204)
  async requestReport(
    @Body() request: { reportType: string; requestedBy: string },
  ): Promise<void> {
    console.info(
      `[${new Date().toISOString()}][HTTP] Processing request...`,
      request,
    );

    await this.kafkaProducerService.pushMessage(
      new RequestReportDto(request.reportType, request.requestedBy),
    );
  }
}
