import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { BullMqModule } from './bullmq/bullmq.module';
import { EachMessagePayload } from 'kafkajs';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';
import { AddJobBullMqService } from './bullmq/add-job.bullmq.service';
import { RequestReportDto } from 'src/_request-report.dto';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'local',
      brokers: ['localhost:9092'],
    }),
    BullMqModule.register({
      redisHost: 'localhost',
      redistPort: 6379,
      redisTtl: 3000,
      queueName: 'requested-reports',
    }),
  ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly addJobBullMqService: AddJobBullMqService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaConsumer.consumer.connect();
    await this.kafkaConsumer.consumer.subscribe({
      topic: 'administration-service.v1.request-report',
      fromBeginning: false,
    });

    await this.kafkaConsumer.consumer.run({
      eachMessage: async (params: EachMessagePayload) => {
        type MessageType = {
          reportType: string;
          requestedBy: string;
        };

        const message = JSON.parse(
          params.message.value.toString(),
        ) as unknown as MessageType;

        this.addJobBullMqService.dispatchJob(
          new RequestReportDto(message.reportType, message.requestedBy),
        );

        console.log(
          `[${new Date().toISOString()}][Kafka] Consuming message...`,
          message,
        );
      },
    });

    return Promise.resolve();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaConsumer.consumer.disconnect();

    return Promise.resolve();
  }
}
