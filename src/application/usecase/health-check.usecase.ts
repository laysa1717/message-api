import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckUseCase {
  getHello(): string {
    return 'Hello World!';
  }
}
