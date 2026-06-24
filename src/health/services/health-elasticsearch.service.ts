import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '../../elasticsearch/elasticsearch.service';

@Injectable()
export class HealthElasticsearchService {
  private readonly logger = new Logger(HealthElasticsearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async check(): Promise<boolean> {
    return this.elasticsearchService.ping();
  }
}
