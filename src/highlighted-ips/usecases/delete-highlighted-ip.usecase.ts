import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { HighlightedIpsPostgresService } from '../services/highlighted-ips-postgres.service';

@Injectable()
export class DeleteHighlightedIpUsecase {
  private readonly logger = new Logger(DeleteHighlightedIpUsecase.name);

  constructor(
    private readonly highlightedIpsPostgresService: HighlightedIpsPostgresService,
  ) {}

  async execute(id: number): Promise<void> {
    this.logger.log(`[execute] Deleting highlighted IP id=${id}`);

    this.logger.log(`[execute] Calling deleteHighlightedIp(id=${id})`);
    const deleted =
      await this.highlightedIpsPostgresService.deleteHighlightedIp(id);
    this.logger.log(
      `[execute] deleteHighlightedIp result: ${deleted ? 'deleted' : 'not found'}`,
    );

    if (!deleted) {
      throw new NotFoundException(`Highlighted IP with id ${id} not found`);
    }
  }
}
