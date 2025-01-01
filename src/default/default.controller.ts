import { Controller, Get } from '@nestjs/common';

@Controller()
export class DefaultController {
  @Get()
  getDefault(): string {
    return 'Welcome to the NestJS API!';
  }

  @Get('health')
  getHealth(): object {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}
