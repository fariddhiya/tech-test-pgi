import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '../../elasticsearch/elasticsearch.service';
import { SecurityAlertSource } from '../../elasticsearch/interfaces/security-alert-source.interface';
import { AlertLogResponseDto } from '../../alerts/dto/alert-log-response.dto';

export interface HighlightedIpActivityResult {
  total: number;
  data: AlertLogResponseDto[];
}

@Injectable()
export class HighlightedIpsElasticsearchService {
  private readonly logger = new Logger(HighlightedIpsElasticsearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getHighlightedIpActivity(
    sourceIps: string[],
    page: number,
    limit: number,
  ): Promise<HighlightedIpActivityResult> {
    const from = (page - 1) * limit;

    const result =
      await this.elasticsearchService.searchAlerts<SecurityAlertSource>({
        query: {
          bool: {
            filter: [{ terms: { src_ip: sourceIps } }],
          },
        },
        from,
        size: limit,
        sort: [{ timestamp: { order: 'desc' } }],
      });

    const total = result.hits.total.value;
    const data = result.hits.hits.map((hit) => ({
      timestamp: hit._source.timestamp,
      sourceIp: hit._source.src_ip,
      targetIp: hit._source.network_target_ip,
      alertName: hit._source.signature_name,
      severity: hit._source.severity,
    }));

    return { total, data };
  }
}
