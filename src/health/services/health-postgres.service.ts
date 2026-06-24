import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../database/postgres.service';

@Injectable()
export class HealthPostgresService {
  private readonly logger = new Logger(HealthPostgresService.name);

  constructor(private readonly postgresService: PostgresService) {}

  async check(): Promise<boolean> {
    return this.postgresService.ping();
  }
}
