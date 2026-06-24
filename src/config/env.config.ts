export interface AppConfig {
  port: number;
}

export interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface ElasticsearchConfig {
  node: string;
  indexSecurityAlerts: string;
}

export function getAppConfig(): AppConfig {
  return {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
  };
}

export function getPostgresConfig(): PostgresConfig {
  console.log('Postgres Host:', process.env.POSTGRES_HOST);
  return {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? 'backend_user',
    password: process.env.POSTGRES_PASSWORD ?? 'secretpassword',
    database: process.env.POSTGRES_DATABASE ?? 'siem_db',
  };
}

export function getElasticsearchConfig(): ElasticsearchConfig {
  console.log('Elasticsearch Node:', process.env.ELASTICSEARCH_NODE);
  return {
    node: process.env.ELASTICSEARCH_NODE ?? 'http://localhost:9200',
    indexSecurityAlerts:
      process.env.ELASTICSEARCH_INDEX_SECURITY_ALERTS ?? 'security-alerts',
  };
}
