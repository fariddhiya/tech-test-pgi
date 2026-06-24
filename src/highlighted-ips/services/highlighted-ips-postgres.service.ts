import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../database/postgres.service';
import {
  HighlightedIpRow,
  HighlightedIpAddressRow,
} from '../interfaces/highlighted-ip-row.interface';

@Injectable()
export class HighlightedIpsPostgresService {
  private readonly logger = new Logger(HighlightedIpsPostgresService.name);

  constructor(private readonly postgresService: PostgresService) {}

  async createHighlightedIp(
    ipAddress: string,
    label: string,
    description: string | null,
  ): Promise<HighlightedIpRow> {
    const result = await this.postgresService.query<HighlightedIpRow>(
      'SELECT * FROM fn_create_highlighted_ip($1, $2, $3)',
      [ipAddress, label, description],
    );
    return result.rows[0];
  }

  async getHighlightedIps(): Promise<HighlightedIpRow[]> {
    const result = await this.postgresService.query<HighlightedIpRow>(
      'SELECT * FROM fn_get_highlighted_ips()',
    );
    return result.rows;
  }

  async getHighlightedIpById(id: number): Promise<HighlightedIpRow | null> {
    const result = await this.postgresService.query<HighlightedIpRow>(
      'SELECT * FROM fn_get_highlighted_ips() WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  }

  async updateHighlightedIp(
    id: number,
    ipAddress: string | null,
    label: string | null,
    description: string | null,
    isActive: boolean | null,
  ): Promise<HighlightedIpRow | null> {
    const result = await this.postgresService.query<HighlightedIpRow>(
      'SELECT * FROM fn_update_highlighted_ip($1, $2, $3, $4, $5)',
      [id, ipAddress, label, description, isActive],
    );
    return result.rows[0] ?? null;
  }

  async deleteHighlightedIp(id: number): Promise<boolean> {
    const result = await this.postgresService.query<HighlightedIpRow>(
      'SELECT * FROM fn_delete_highlighted_ip($1)',
      [id],
    );
    return result.rows.length > 0;
  }

  async getActiveHighlightedIpAddresses(): Promise<string[]> {
    const result = await this.postgresService.query<HighlightedIpAddressRow>(
      'SELECT * FROM fn_get_active_highlighted_ip_addresses()',
    );
    return result.rows.map((row) => row.ip_address);
  }
}
