import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'local',
      brokers: ['localhost:9092'],
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
