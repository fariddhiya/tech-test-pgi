import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UpdateHighlightedIpDto } from '../dto/update-highlighted-ip.dto';
import { HighlightedIpResponseDto } from '../dto/highlighted-ip-response.dto';
import { HighlightedIpsPostgresService } from '../services/highlighted-ips-postgres.service';

@Injectable()
export class UpdateHighlightedIpUsecase {
  private readonly logger = new Logger(UpdateHighlightedIpUsecase.name);

  constructor(
    private readonly highlightedIpsPostgresService: HighlightedIpsPostgresService,
  ) {}

  async execute(
    id: number,
    dto: UpdateHighlightedIpDto,
  ): Promise<HighlightedIpResponseDto> {
    this.logger.log(
      `[execute] Updating highlighted IP id=${id}: ${JSON.stringify(dto)}`,
    );

    this.logger.log(`[execute] Calling getHighlightedIpById(id=${id})`);
    const existing =
      await this.highlightedIpsPostgresService.getHighlightedIpById(id);
    this.logger.log(
      `[execute] getHighlightedIpById result: ${existing ? 'found' : 'not found'}`,
    );

    if (!existing) {
      throw new NotFoundException(`Highlighted IP with id ${id} not found`);
    }

    try {
      this.logger.log(`[execute] Calling updateHighlightedIp(id=${id})`);
      const row = await this.highlightedIpsPostgresService.updateHighlightedIp(
        id,
        dto.ipAddress ?? null,
        dto.label ?? null,
        dto.description ?? null,
        dto.isActive ?? null,
      );
      this.logger.log(
        `[execute] updateHighlightedIp result: ${row ? 'success' : 'not found'}`,
      );

      if (!row) {
        throw new NotFoundException(`Highlighted IP with id ${id} not found`);
      }

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
      if (error instanceof NotFoundException) {
        throw error;
      }
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
