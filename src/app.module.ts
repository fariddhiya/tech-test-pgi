import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HighlightedIpsModule } from './highlighted-ips/highlighted-ips.module';
import { HealthModule } from './health/health.module';
import { PostgresModule } from './database/postgres.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    ElasticsearchModule,
    AlertsModule,
    DashboardModule,
    HighlightedIpsModule,
    HealthModule,
  ],
})
export class AppModule {}
