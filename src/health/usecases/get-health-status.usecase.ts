import { Injectable, Logger } from '@nestjs/common';
import { HealthPostgresService } from '../services/health-postgres.service';
import { HealthElasticsearchService } from '../services/health-elasticsearch.service';
import { HealthCheckResult } from '../interfaces/health-check-result.interface';

@Injectable()
export class GetHealthStatusUsecase {
  private readonly logger = new Logger(GetHealthStatusUsecase.name);

  constructor(
    private readonly healthPostgresService: HealthPostgresService,
    private readonly healthElasticsearchService: HealthElasticsearchService,
  ) {}

  async execute(): Promise<HealthCheckResult> {
    this.logger.log(
      `[execute] Checking health - calling postgres and elasticsearch`,
    );

    const [postgresUp, elasticsearchUp] = await Promise.all([
      this.healthPostgresService.check(),
      this.healthElasticsearchService.check(),
    ]);

    this.logger.log(
      `[execute] Postgres: ${postgresUp}, Elasticsearch: ${elasticsearchUp}`,
    );

    const services = {
      postgres: postgresUp ? ('up' as const) : ('down' as const),
      elasticsearch: elasticsearchUp ? ('up' as const) : ('down' as const),
    };

    const status: 'healthy' | 'degraded' =
      postgresUp && elasticsearchUp ? 'healthy' : 'degraded';

    this.logger.log(`[execute] Health status: ${status}`);

    return { status, services };
  }
}
