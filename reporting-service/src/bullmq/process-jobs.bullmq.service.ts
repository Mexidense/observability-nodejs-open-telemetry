import { Job, Worker } from 'bullmq';
import { BullMqConfig } from './bullmq.module';

export class ProcessJobsBullMqService {
  private worker: Worker;

  constructor(bullMqConfig: BullMqConfig) {
    this.worker = new Worker(
      bullMqConfig.queueName,
      async (job: Job) => {
        console.log(
          `[${new Date().toISOString()}][BullMQ] Processing job...`,
          job.data.body,
        );

        return Promise.resolve();
      },
      {
        connection: {
          host: bullMqConfig.redisHost,
          port: bullMqConfig.redistPort,
          enableOfflineQueue: false,
        },
      },
    );
  }
}
