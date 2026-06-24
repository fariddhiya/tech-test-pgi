import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { GetTopTargetedAssetsUsecase } from './usecases/get-top-targeted-assets.usecase';
import { DashboardPostgresService } from './services/dashboard-postgres.service';
import { DashboardElasticsearchService } from './services/dashboard-elasticsearch.service';

@Module({
  controllers: [DashboardController],
  providers: [
    GetTopTargetedAssetsUsecase,
    DashboardPostgresService,
    DashboardElasticsearchService,
  ],
})
export class DashboardModule {}
