import { Queue } from 'bullmq';
import { BullMqConfig } from './bullmq.module';
import { RequestReportDto } from 'src/request-report.dto';

export class AddJobBullMqService {
  private queue: Queue;

  constructor(bullMqConfig: BullMqConfig) {
    this.queue = new Queue(bullMqConfig.queueName, {
      connection: {
        host: bullMqConfig.redisHost,
        port: bullMqConfig.redistPort,
        enableOfflineQueue: false,
      },
    });
  }

  public async dispatchJob(command: RequestReportDto): Promise<void> {
    await this.queue.add('requested-report', {
      body: {
        ...command,
      },
    });

    console.info(
      `[${new Date().toISOString()}][BullMQ] Dispatching job...`,
      command,
    );
  }
}
