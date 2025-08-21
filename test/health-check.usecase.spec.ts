import { HealthCheckUseCase } from '../src/application/usecase/health-check.usecase';

describe('HealthCheckUseCase', () => {
  let healthCheckUseCase: HealthCheckUseCase;

  beforeEach(() => {
    healthCheckUseCase = new HealthCheckUseCase();
  });

  it('should return a healthy status', () => {
    const result = healthCheckUseCase.getHello();
    expect(result).toEqual({ status: 'healthy' });
  });
});
