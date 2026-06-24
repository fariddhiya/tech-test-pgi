import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '../../elasticsearch/elasticsearch.service';
import { TopTargetedIp } from '../interfaces/top-targeted-ip.interface';

@Injectable()
export class DashboardElasticsearchService {
  private readonly logger = new Logger(DashboardElasticsearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getTopTargetedAssets(size: number = 5): Promise<TopTargetedIp[]> {
    return this.elasticsearchService.aggregateTopTargetedAssets(size);
  }
}
