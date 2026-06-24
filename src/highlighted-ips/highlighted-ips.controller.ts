import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiDocResponse,
} from '@nestjs/swagger';
import { CreateHighlightedIpDto } from './dto/create-highlighted-ip.dto';
import { UpdateHighlightedIpDto } from './dto/update-highlighted-ip.dto';
import { HighlightedIpActivityQueryDto } from './dto/highlighted-ip-activity-query.dto';
import { CreateHighlightedIpUsecase } from './usecases/create-highlighted-ip.usecase';
import { GetHighlightedIpsUsecase } from './usecases/get-highlighted-ips.usecase';
import { UpdateHighlightedIpUsecase } from './usecases/update-highlighted-ip.usecase';
import { DeleteHighlightedIpUsecase } from './usecases/delete-highlighted-ip.usecase';
import { GetHighlightedIpActivityUsecase } from './usecases/get-highlighted-ip-activity.usecase';
import { ApiResponse as ApiResponseInterface } from '../common/interfaces/api-response.interface';
import { HighlightedIpResponseDto } from './dto/highlighted-ip-response.dto';
import { PaginationMeta } from '../common/interfaces/pagination-meta.interface';
import { AlertLogResponseDto } from '../alerts/dto/alert-log-response.dto';

@ApiTags('Highlighted IPs')
@Controller('highlighted-ips')
export class HighlightedIpsController {
  constructor(
    private readonly createHighlightedIpUsecase: CreateHighlightedIpUsecase,
    private readonly getHighlightedIpsUsecase: GetHighlightedIpsUsecase,
    private readonly updateHighlightedIpUsecase: UpdateHighlightedIpUsecase,
    private readonly deleteHighlightedIpUsecase: DeleteHighlightedIpUsecase,
    private readonly getHighlightedIpActivityUsecase: GetHighlightedIpActivityUsecase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a highlighted IP' })
  @ApiDocResponse({
    status: 201,
    description: 'Successfully created highlighted IP',
  })
  async create(
    @Body() dto: CreateHighlightedIpDto,
  ): Promise<ApiResponseInterface<HighlightedIpResponseDto>> {
    const result = await this.createHighlightedIpUsecase.execute(dto);

    return {
      success: true,
      message: 'Successfully created highlighted IP',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all highlighted IPs' })
  @ApiDocResponse({
    status: 200,
    description: 'Successfully retrieved highlighted IPs',
  })
  async findAll(): Promise<ApiResponseInterface<HighlightedIpResponseDto[]>> {
    const result = await this.getHighlightedIpsUsecase.execute();

    return {
      success: true,
      message: 'Successfully retrieved highlighted IPs',
      data: result,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a highlighted IP' })
  @ApiDocResponse({
    status: 200,
    description: 'Successfully updated highlighted IP',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHighlightedIpDto,
  ): Promise<ApiResponseInterface<HighlightedIpResponseDto>> {
    const result = await this.updateHighlightedIpUsecase.execute(id, dto);

    return {
      success: true,
      message: 'Successfully updated highlighted IP',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a highlighted IP' })
  @ApiDocResponse({
    status: 200,
    description: 'Successfully deleted highlighted IP',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseInterface<null>> {
    await this.deleteHighlightedIpUsecase.execute(id);

    return {
      success: true,
      message: 'Successfully deleted highlighted IP',
      data: null,
    };
  }

  @Get('activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get activity logs for highlighted IPs' })
  @ApiDocResponse({
    status: 200,
    description: 'Successfully retrieved data',
  })
  async getActivity(
    @Query() query: HighlightedIpActivityQueryDto,
  ): Promise<ApiResponseInterface<AlertLogResponseDto[], PaginationMeta>> {
    const { page = 1, limit = 20 } = query;
    const result = await this.getHighlightedIpActivityUsecase.execute(
      page,
      limit,
    );

    return {
      success: true,
      message: 'Successfully retrieved data',
      meta: result.meta,
      data: result.data,
    };
  }
}
