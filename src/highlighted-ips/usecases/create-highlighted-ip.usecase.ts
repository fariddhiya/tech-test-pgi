import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { CreateHighlightedIpDto } from '../dto/create-highlighted-ip.dto';
import { HighlightedIpResponseDto } from '../dto/highlighted-ip-response.dto';
import { HighlightedIpsPostgresService } from '../services/highlighted-ips-postgres.service';

@Injectable()
export class CreateHighlightedIpUsecase {
  private readonly logger = new Logger(CreateHighlightedIpUsecase.name);

  constructor(
    private readonly highlightedIpsPostgresService: HighlightedIpsPostgresService,
  ) {}

  async execute(
    dto: CreateHighlightedIpDto,
  ): Promise<HighlightedIpResponseDto> {
    this.logger.log(
      `[execute] Creating highlighted IP: ip=${dto.ipAddress}, label=${dto.label}, description=${dto.description}`,
    );

    try {
      this.logger.log(
        `[execute] Calling createHighlightedIp(ipAddress=${dto.ipAddress}, label=${dto.label})`,
      );
      const row = await this.highlightedIpsPostgresService.createHighlightedIp(
        dto.ipAddress,
        dto.label,
        dto.description ?? null,
      );
      this.logger.log(`[execute] createHighlightedIp result: id=${row.id}`);

      return {
        id: row.id,
        ipAddress: row.ip_address,
        label: row.label,
        description: row.description,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('unique') || message.includes('duplicate')) {
        throw new ConflictException(
          `Highlighted IP with address ${dto.ipAddress} already exists`,
        );
      }
      throw error;
    }
  }
}
