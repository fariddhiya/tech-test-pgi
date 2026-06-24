export interface HighlightedIpRow {
  id: number;
  ip_address: string;
  label: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface HighlightedIpAddressRow {
  ip_address: string;
}
