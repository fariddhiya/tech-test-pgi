import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiDocResponse,
} from '@nestjs/swagger';
import { GetTopTargetedAssetsUsecase } from './usecases/get-top-targeted-assets.usecase';
import { ApiResponse as ApiResponseInterface } from '../common/interfaces/api-response.interface';
import { TopTargetedAssetResponseDto } from './dto/top-targeted-asset-response.dto';
import { DashboardMeta } from './usecases/get-top-targeted-assets.usecase';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getTopTargetedAssetsUsecase: GetTopTargetedAssetsUsecase,
  ) {}

  @Get('top-targeted-assets')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get top 5 most targeted internal assets' })
  @ApiDocResponse({
    status: 200,
    description: 'Successfully fetched top targeted assets',
  })
  async getTopTargetedAssets(): Promise<
    ApiResponseInterface<TopTargetedAssetResponseDto[], DashboardMeta>
  > {
    const result = await this.getTopTargetedAssetsUsecase.execute();

    return {
      success: true,
      message: 'Successfully fetched top targeted assets',
      meta: result.meta,
      data: result.data,
    };
  }
}
