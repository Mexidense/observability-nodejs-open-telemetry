import { DynamicModule, Module } from '@nestjs/common';
import { AddJobBullMqService } from './add-job.bullmq.service';
import { ProcessJobsBullMqService } from './process-jobs.bullmq.service';

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
          useFactory: () => new ProcessJobsBullMqService(bullMqConfig),
        },
      ],
      exports: [AddJobBullMqService, ProcessJobsBullMqService],
    };
  }
}
