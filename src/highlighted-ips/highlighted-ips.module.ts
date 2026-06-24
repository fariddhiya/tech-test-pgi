import { Module } from '@nestjs/common';
import { HighlightedIpsController } from './highlighted-ips.controller';
import { CreateHighlightedIpUsecase } from './usecases/create-highlighted-ip.usecase';
import { GetHighlightedIpsUsecase } from './usecases/get-highlighted-ips.usecase';
import { UpdateHighlightedIpUsecase } from './usecases/update-highlighted-ip.usecase';
import { DeleteHighlightedIpUsecase } from './usecases/delete-highlighted-ip.usecase';
import { GetHighlightedIpActivityUsecase } from './usecases/get-highlighted-ip-activity.usecase';
import { HighlightedIpsPostgresService } from './services/highlighted-ips-postgres.service';
import { HighlightedIpsElasticsearchService } from './services/highlighted-ips-elasticsearch.service';

@Module({
  controllers: [HighlightedIpsController],
  providers: [
    CreateHighlightedIpUsecase,
    GetHighlightedIpsUsecase,
    UpdateHighlightedIpUsecase,
    DeleteHighlightedIpUsecase,
    GetHighlightedIpActivityUsecase,
    HighlightedIpsPostgresService,
    HighlightedIpsElasticsearchService,
  ],
})
export class HighlightedIpsModule {}
