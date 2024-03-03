import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaService } from './kafka/kafka.service';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'local',
      brokers: ['localhost:9092'],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useFactory: (kafkaService: KafkaService) => new AppService(kafkaService),
      inject: [KafkaService],
    },
  ],
})
export class AppModule {}
