import { Injectable, Logger } from '@nestjs/common';
import { HighlightedIpsPostgresService } from '../services/highlighted-ips-postgres.service';
import { HighlightedIpsElasticsearchService } from '../services/highlighted-ips-elasticsearch.service';
import { AlertLogResponseDto } from '../../alerts/dto/alert-log-response.dto';
import { PaginationMeta } from '../../common/interfaces/pagination-meta.interface';

export interface GetHighlightedIpActivityResult {
  meta: PaginationMeta;
  data: AlertLogResponseDto[];
}

@Injectable()
export class GetHighlightedIpActivityUsecase {
  private readonly logger = new Logger(GetHighlightedIpActivityUsecase.name);

  constructor(
    private readonly highlightedIpsPostgresService: HighlightedIpsPostgresService,
    private readonly highlightedIpsElasticsearchService: HighlightedIpsElasticsearchService,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<GetHighlightedIpActivityResult> {
    this.logger.log(`[execute] page=${page}, limit=${limit}`);

    this.logger.log(`[execute] Calling getActiveHighlightedIpAddresses()`);
    const activeIps =
      await this.highlightedIpsPostgresService.getActiveHighlightedIpAddresses();
    this.logger.log(
      `[execute] getActiveHighlightedIpAddresses result: ${JSON.stringify(activeIps)}`,
    );

    if (activeIps.length === 0) {
      this.logger.log(`[execute] No active IPs found, returning empty result`);
      return {
        meta: { totalData: 0, page, limit },
        data: [],
      };
    }

    this.logger.log(
      `[execute] Calling getHighlightedIpActivity(ips=${JSON.stringify(activeIps)}, page=${page}, limit=${limit})`,
    );
    const result =
      await this.highlightedIpsElasticsearchService.getHighlightedIpActivity(
        activeIps,
        page,
        limit,
      );
    this.logger.log(
      `[execute] getHighlightedIpActivity result: total=${result.total}, dataCount=${result.data.length}`,
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
