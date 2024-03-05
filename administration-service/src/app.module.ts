import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaProducerService } from './kafka/kafka-producer.service';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'local',
      brokers: ['localhost:9092'],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaProducer.producer.connect();

    return Promise.resolve();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaProducer.producer.disconnect();

    return Promise.resolve();
  }
}
