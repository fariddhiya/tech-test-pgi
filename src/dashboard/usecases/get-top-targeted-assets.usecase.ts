import { Injectable, Logger } from '@nestjs/common';
import { DashboardPostgresService } from '../services/dashboard-postgres.service';
import { DashboardElasticsearchService } from '../services/dashboard-elasticsearch.service';
import { TopTargetedAssetResponseDto } from '../dto/top-targeted-asset-response.dto';

export interface DashboardMeta {
  totalData: number;
}

export interface GetTopTargetedAssetsResult {
  meta: DashboardMeta;
  data: TopTargetedAssetResponseDto[];
}

@Injectable()
export class GetTopTargetedAssetsUsecase {
  private readonly logger = new Logger(GetTopTargetedAssetsUsecase.name);

  constructor(
    private readonly dashboardPostgresService: DashboardPostgresService,
    private readonly dashboardElasticsearchService: DashboardElasticsearchService,
  ) {}

  async execute(): Promise<GetTopTargetedAssetsResult> {
    this.logger.log(`[execute] Calling getTopTargetedAssets(limit=5)`);
    const topIps =
      await this.dashboardElasticsearchService.getTopTargetedAssets(5);
    this.logger.log(
      `[execute] getTopTargetedAssets result: ${JSON.stringify(topIps)}`,
    );

    if (topIps.length === 0) {
      this.logger.log(`[execute] No top IPs found, returning empty result`);
      return {
        meta: { totalData: 0 },
        data: [],
      };
    }

    const hostIdentifiers = topIps.map((ip) => ip.key);
    this.logger.log(
      `[execute] Calling getAssetsByHostIdentifiers(hostIdentifiers=${JSON.stringify(hostIdentifiers)})`,
    );
    const enrichmentMap =
      await this.dashboardPostgresService.getAssetsByHostIdentifiers(
        hostIdentifiers,
      );
    this.logger.log(
      `[execute] getAssetsByHostIdentifiers result: ${enrichmentMap.size} assets`,
    );

    const data: TopTargetedAssetResponseDto[] = topIps.map((ip) => {
      const asset = enrichmentMap.get(ip.key);
      return {
        targetIp: ip.key,
        totalAttacks: ip.doc_count,
        assetName: asset?.asset_name ?? null,
        department: asset?.department_owner ?? null,
      };
    });

    return {
        meta: { totalData: data.length },
      data,
    };
  }
}
