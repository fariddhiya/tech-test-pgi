import { Injectable, Logger } from '@nestjs/common';
import { HighlightedIpResponseDto } from '../dto/highlighted-ip-response.dto';
import { HighlightedIpsPostgresService } from '../services/highlighted-ips-postgres.service';

@Injectable()
export class GetHighlightedIpsUsecase {
  private readonly logger = new Logger(GetHighlightedIpsUsecase.name);

  constructor(
    private readonly highlightedIpsPostgresService: HighlightedIpsPostgresService,
  ) {}

  async execute(): Promise<HighlightedIpResponseDto[]> {
    this.logger.log(`[execute] Calling getHighlightedIps()`);
    let rows;
    try {
      rows = await this.highlightedIpsPostgresService.getHighlightedIps();
    } catch (error) {
      this.logger.warn(
        `[execute] Failed to fetch highlighted IPs, returning empty array`,
      );
      return [];
    }
    this.logger.log(`[execute] getHighlightedIps result: ${rows.length} rows`);

    return rows.map((row) => ({
      id: row.id,
      ipAddress: row.ip_address,
      label: row.label,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}
