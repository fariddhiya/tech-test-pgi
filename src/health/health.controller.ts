import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetHealthStatusUsecase } from './usecases/get-health-status.usecase';
import { HealthCheckResult } from './interfaces/health-check-result.interface';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly getHealthStatusUsecase: GetHealthStatusUsecase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check service health status' })
  async getHealthStatus(): Promise<HealthCheckResult> {
    return this.getHealthStatusUsecase.execute();
  }
}
