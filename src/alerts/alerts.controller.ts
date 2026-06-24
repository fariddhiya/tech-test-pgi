import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiDocResponse,
} from '@nestjs/swagger';
import { GetAlertsQueryDto } from './dto/get-alerts-query.dto';
import { GetFilteredAlertsUsecase } from './usecases/get-filtered-alerts.usecase';
import { ApiResponse as ApiResponseInterface } from '../common/interfaces/api-response.interface';
import { AlertLogResponseDto } from './dto/alert-log-response.dto';
import { PaginationMeta } from '../common/interfaces/pagination-meta.interface';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly getFilteredAlertsUsecase: GetFilteredAlertsUsecase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get filtered alert logs' })
  @ApiDocResponse({
    status: 200,
    description: 'Successfully fetched alert logs',
  })
  async getAlerts(
    @Query() query: GetAlertsQueryDto,
  ): Promise<ApiResponseInterface<AlertLogResponseDto[], PaginationMeta>> {
    const result = await this.getFilteredAlertsUsecase.execute(query);

    return {
      success: true,
      message: 'Successfully fetched alert logs',
      meta: result.meta,
      data: result.data,
    };
  }
}
