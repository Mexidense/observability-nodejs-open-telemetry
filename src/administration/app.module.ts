import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaModule } from './kafka/kafka.module';

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
export class AppModule {}
