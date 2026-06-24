import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../database/postgres.service';
import { AssetEnrichmentRow } from '../interfaces/asset-enrichment-row.interface';

@Injectable()
export class DashboardPostgresService {
  private readonly logger = new Logger(DashboardPostgresService.name);

  constructor(private readonly postgresService: PostgresService) {}

  async getAssetsByHostIdentifiers(
    hostIdentifiers: string[],
  ): Promise<Map<string, AssetEnrichmentRow>> {
    if (hostIdentifiers.length === 0) {
      return new Map();
    }

    const result = await this.postgresService.query<AssetEnrichmentRow>(
      'SELECT * FROM fn_get_assets_by_host_identifiers($1)',
      [hostIdentifiers],
    );

    const enrichmentMap = new Map<string, AssetEnrichmentRow>();
    for (const row of result.rows) {
      enrichmentMap.set(row.host_identifier_local, row);
    }

    return enrichmentMap;
  }
}
