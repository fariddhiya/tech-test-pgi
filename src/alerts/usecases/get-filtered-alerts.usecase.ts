import { Injectable, Logger } from '@nestjs/common';
import { GetAlertsQueryDto } from '../dto/get-alerts-query.dto';
import { AlertLogResponseDto } from '../dto/alert-log-response.dto';
import { AlertsPostgresService } from '../services/alerts-postgres.service';
import { AlertsElasticsearchService } from '../services/alerts-elasticsearch.service';
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface';

export interface GetFilteredAlertsResult {
  meta: PaginationMeta;
  data: AlertLogResponseDto[];
}

@Injectable()
export class GetFilteredAlertsUsecase {
  private readonly logger = new Logger(GetFilteredAlertsUsecase.name);

  constructor(
    private readonly alertsPostgresService: AlertsPostgresService,
    private readonly alertsElasticsearchService: AlertsElasticsearchService,
  ) {}

  async execute(query: GetAlertsQueryDto): Promise<GetFilteredAlertsResult> {
    const { department, risk, page = 1, limit = 20 } = query;

    this.logger.log(
      `[execute] Query: department=${department}, risk=${risk}, page=${page}, limit=${limit}`,
    );

    this.logger.log(
      `[execute] Calling getAssetTargetIps(department=${department}, risk=${risk})`,
    );
    const targetIps = await this.alertsPostgresService.getAssetTargetIps(
      department ?? null,
      risk ?? null,
    );
    this.logger.log(
      `[execute] getAssetTargetIps result: ${JSON.stringify(targetIps)}`,
    );

    if (targetIps.length === 0) {
      this.logger.log(`[execute] No target IPs found, returning empty result`);
      return {
        meta: { totalData: 0, page, limit },
        data: [],
      };
    }

    this.logger.log(
      `[execute] Calling getFilteredAlerts(targetIps=${JSON.stringify(targetIps)}, page=${page}, limit=${limit})`,
    );
    const result = await this.alertsElasticsearchService.getFilteredAlerts(
      targetIps,
      page,
      limit,
    );
    this.logger.log(
      `[execute] getFilteredAlerts result: total=${result.total}, dataCount=${result.data.length}`,
    );

    return {
      meta: {
        totalData: result.total,
        page,
        limit,
      },
      data: result.data,
    };
  }
}
