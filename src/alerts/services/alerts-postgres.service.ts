import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../database/postgres.service';
import { AssetTargetIpRow } from '../interfaces/asset-target-ip-row.interface';

@Injectable()
export class AlertsPostgresService {
  private readonly logger = new Logger(AlertsPostgresService.name);

  constructor(private readonly postgresService: PostgresService) {}

  async getAssetTargetIps(
    department: string | null,
    risk: string | null,
  ): Promise<string[]> {
    const result = await this.postgresService.query<AssetTargetIpRow>(
      'SELECT * FROM fn_get_asset_target_ips($1, $2)',
      [department, risk],
    );

    return result.rows.map((row) => row.host_identifier_local);
  }
}
