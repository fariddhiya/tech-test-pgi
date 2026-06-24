import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { GetHealthStatusUsecase } from './usecases/get-health-status.usecase';
import { HealthPostgresService } from './services/health-postgres.service';
import { HealthElasticsearchService } from './services/health-elasticsearch.service';

@Module({
  controllers: [HealthController],
  providers: [
    GetHealthStatusUsecase,
    HealthPostgresService,
    HealthElasticsearchService,
  ],
})
export class HealthModule {}
