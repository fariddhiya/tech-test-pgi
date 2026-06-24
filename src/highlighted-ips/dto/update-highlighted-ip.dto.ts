import { IsOptional, IsBoolean, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHighlightedIpDto {
  @ApiPropertyOptional({ description: 'IP address to highlight' })
  @IsOptional()
  @IsString()
  @Matches(
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    { message: 'ipAddress must be a valid IPv4 address' },
  )
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Label for the highlighted IP' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ description: 'Description of the highlighted IP' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the highlighted IP is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
