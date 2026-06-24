import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { GetFilteredAlertsUsecase } from './usecases/get-filtered-alerts.usecase';
import { AlertsPostgresService } from './services/alerts-postgres.service';
import { AlertsElasticsearchService } from './services/alerts-elasticsearch.service';

@Module({
  controllers: [AlertsController],
  providers: [
    GetFilteredAlertsUsecase,
    AlertsPostgresService,
    AlertsElasticsearchService,
  ],
})
export class AlertsModule {}
