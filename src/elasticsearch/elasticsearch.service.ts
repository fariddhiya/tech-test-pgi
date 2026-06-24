import {
  Injectable,
  OnModuleDestroy,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { getElasticsearchConfig } from '../config/env.config';

export interface EsSearchResponse<T> {
  hits: {
    total: { value: number; relation: string };
    hits: Array<{ _source: T }>;
  };
}

export interface EsAggregationResponse {
  aggregations?: {
    top_ips: {
      buckets: Array<{ key: string; doc_count: number }>;
    };
  };
}

@Injectable()
export class ElasticsearchService implements OnModuleDestroy {
  private readonly client: Client;
  private readonly index: string;
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor() {
    const config = getElasticsearchConfig();
    this.client = new Client({ node: config.node });
    this.index = config.indexSecurityAlerts;
  }

  async searchAlerts<T extends Record<string, unknown>>(params: {
    query: Record<string, unknown>;
    from?: number;
    size?: number;
    sort?: Array<Record<string, Record<string, string>>>;
  }): Promise<EsSearchResponse<T>> {
    try {
      const result = await this.client.search<T>({
        index: this.index,
        ...params,
      });
      return result as unknown as EsSearchResponse<T>;
    } catch (error) {
      this.handleEsError(error);
    }
  }

  async aggregateTopTargetedAssets(
    size: number = 5,
  ): Promise<Array<{ key: string; doc_count: number }>> {
    try {
      const result = await this.client.search({
        index: this.index,
        size: 0,
        aggs: {
          top_ips: {
            terms: {
              field: 'network_target_ip',
              size,
              order: { _count: 'desc' },
            },
          },
        },
      } as never);

      const body = result as unknown as EsAggregationResponse;
      if (!body.aggregations) {
        return [];
      }
      return body.aggregations.top_ips.buckets;
    } catch (error) {
      this.handleEsError(error);
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  private handleEsError(error: unknown): never {
    const esError = error as {
      meta?: { body?: { error?: { type?: string; reason?: string } } };
    };
    const errorType = esError?.meta?.body?.error?.type;

    this.logger.error(
      `Elasticsearch error: ${errorType}`,
      (error as Error).stack,
    );

    if (errorType === 'index_not_found_exception') {
      throw new NotFoundException(`Index "${this.index}" not found`);
    }
    throw new InternalServerErrorException('Elasticsearch query failed');
  }
}
