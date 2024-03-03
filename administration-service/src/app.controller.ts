import { Controller, Body, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('report')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(204)
  async requestReport(@Body() request: { message: string }): Promise<void> {
    await this.appService.getHello(request.message);
  }
}
