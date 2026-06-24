import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHighlightedIpDto {
  @ApiProperty({
    description: 'IP address to highlight',
    example: '185.220.101.5',
  })
  @IsString()
  @Matches(
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    { message: 'ipAddress must be a valid IPv4 address' },
  )
  ipAddress!: string;

  @ApiProperty({
    description: 'Label for the highlighted IP',
    example: 'Known C2 Server',
  })
  @IsString()
  label!: string;

  @ApiPropertyOptional({ description: 'Description of the highlighted IP' })
  @IsOptional()
  @IsString()
  description?: string;
}
