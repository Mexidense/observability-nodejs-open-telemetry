import { DynamicModule, Module } from '@nestjs/common';
import { AddJobBullMqService } from './add-job.bullmq.service';
import { ProcessJobsBullMqService } from './process-jobs.bullmq.service';
import { AwsS3PublisherService } from 'src/aws-s3-publisher.service';
import { S3 } from '@aws-sdk/client-s3';

export type BullMqConfig = {
  redisHost: string;
  redistPort?: number;
  redisTtl: number;
  queueName?: string;
};

@Module({})
export class BullMqModule {
  static register(bullMqConfig: BullMqConfig): DynamicModule {
    return {
      global: true,
      module: BullMqModule,
      providers: [
        {
          provide: AddJobBullMqService,
          useFactory: () => new AddJobBullMqService(bullMqConfig),
        },
        {
          provide: ProcessJobsBullMqService,
          useFactory: (awsS3PublisherService: AwsS3PublisherService) => {
            return new ProcessJobsBullMqService(
              bullMqConfig,
              awsS3PublisherService,
            );
          },
          inject: [AwsS3PublisherService],
        },
        {
          provide: AwsS3PublisherService,
          useFactory: () => {
            return new AwsS3PublisherService(
              new S3({
                region: 'eu-west-1',
                apiVersion: '2006-03-01',
                endpoint: 'http://localhost:9000',
                forcePathStyle: true,
                credentials: {
                  accessKeyId: 'root_user',
                  secretAccessKey: 'root_pass',
                },
              }),
              'reports-bucket',
            );
          },
        },
      ],
      exports: [AddJobBullMqService, ProcessJobsBullMqService],
    };
  }
}
