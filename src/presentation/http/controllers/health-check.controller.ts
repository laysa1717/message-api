import { Controller, Get } from '@nestjs/common';
import { HealthCheckUseCase } from '../../../application/usecase/health-check.usecase';

@Controller()
export class HealthCheckController {
  constructor(private readonly healthcheckusecase: HealthCheckUseCase) {}

  @Get()
  getHello(): string {
    return this.healthcheckusecase.getHello();
  }
}
