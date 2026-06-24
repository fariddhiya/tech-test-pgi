export interface HighlightedIpResponseDto {
  id: number;
  ipAddress: string;
  label: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
