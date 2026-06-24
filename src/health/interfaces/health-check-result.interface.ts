export interface HealthCheckResult {
  status: 'healthy' | 'degraded';
  services: {
    postgres: 'up' | 'down';
    elasticsearch: 'up' | 'down';
  };
}
