export interface SecurityAlertSource {
  [key: string]: unknown;
  timestamp: string;
  src_ip: string;
  network_target_ip: string;
  signature_name: string;
  severity: number;
}
