export interface AlertLogResponseDto {
  timestamp: string;
  sourceIp: string;
  targetIp: string;
  alertName: string;
  severity: number;
}
