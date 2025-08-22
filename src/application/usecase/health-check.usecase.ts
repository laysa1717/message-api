import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckUseCase {
  getHello(): { status: string } {
    return { status: 'healthy' };
  }
}
