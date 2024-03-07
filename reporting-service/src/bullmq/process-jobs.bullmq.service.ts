import { Job, Worker } from 'bullmq';
import { BullMqConfig } from './bullmq.module';
import { AwsS3PublisherService } from 'src/aws-s3-publisher.service';

export class ProcessJobsBullMqService {
  private worker: Worker;

  constructor(
    bullMqConfig: BullMqConfig,
    private readonly awsS3PublisherService: AwsS3PublisherService,
  ) {
    this.worker = new Worker(
      bullMqConfig.queueName,
      async (job: Job) => {
        type JobDataType = {
          reportType: string;
          requestedBy: string;
        };

        const jobData = job.data.body as unknown as JobDataType;

        console.log(
          `[${new Date().toISOString()}][BullMQ] Processing job...`,
          jobData,
        );

        const report = JSON.stringify({
          user: jobData.requestedBy,
          type: jobData.reportType,
          data: 'random_information',
        });

        await this.awsS3PublisherService.pushFile(report);

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
