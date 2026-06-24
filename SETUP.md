# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker and Docker Compose

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd tech-test-pgi
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` if needed (default values should work with Docker setup):

```env
APP_PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=backend_user
POSTGRES_PASSWORD=secretpassword
POSTGRES_DATABASE=siem_db

ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX_SECURITY_ALERTS=security-alerts
```

## Step 4: Start Infrastructure

Start PostgreSQL and Elasticsearch using Docker Compose:

```bash
docker-compose up -d
```

This will:

- Start PostgreSQL on port 5432
- Start Elasticsearch on port 9200
- Create the `internal_infrastructure_assets` table with sample data
- Create the `security-alerts` index with sample alert data

Wait for services to be ready (approximately 30 seconds).

## Step 5: Run Migrations

Create PostgreSQL functions required by the application:

```bash
npm run migration:run
```

This creates:

- `fn_get_asset_target_ips()` - For alert filtering
- `fn_get_assets_by_host_identifiers()` - For dashboard enrichment
- `fn_create_highlighted_ip()` - For highlighted IP CRUD
- `fn_get_highlighted_ips()` - For highlighted IP retrieval
- `fn_update_highlighted_ip()` - For highlighted IP updates
- `fn_delete_highlighted_ip()` - For highlighted IP deletion
- `fn_get_active_highlighted_ip_addresses()` - For activity monitoring

## Step 5b: Seed Elasticsearch Data (Optional)

To generate large-scale test data (default: 1 million records):

```bash
npm run seed:es
```

This will:

- Create the `security-alerts` index if it doesn't exist
- Generate 1,000,000 alert records with realistic distributions
- Use bulk API for fast insertion (~50k records/second)

Customize the record count via environment variable:

```bash
SEED_COUNT=5000000 npm run seed:es
```

## Step 6: Run Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## Step 7: Access Swagger Documentation

Open browser and navigate to:

```
http://localhost:3000/api
```

## Step 8: Test Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "services": {
    "postgres": "up",
    "elasticsearch": "up"
  }
}
```

### Step 9: Dockerized Project 
```bash
docker compose up -d --build
```

## Example API Requests

### Get Alerts (All)

```bash
curl "http://localhost:3000/alerts"
```

### Get Alerts by Department

```bash
curl "http://localhost:3000/alerts?department=Finance"
```

### Get Alerts by Risk Level

```bash
curl "http://localhost:3000/alerts?risk=High"
```

### Get Alerts with Pagination

```bash
curl "http://localhost:3000/alerts?page=1&limit=10"
```

### Get Top Targeted Assets

```bash
curl "http://localhost:3000/dashboard/top-targeted-assets"
```

### Create Highlighted IP

```bash
curl -X POST "http://localhost:3000/highlighted-ips" \
  -H "Content-Type: application/json" \
  -d '{
    "ip_address": "185.220.101.5",
    "label": "Known C2 Server",
    "description": "Suspicious IP flagged by threat intelligence"
  }'
```

### Get All Highlighted IPs

```bash
curl "http://localhost:3000/highlighted-ips"
```

### Update Highlighted IP

```bash
curl -X PATCH "http://localhost:3000/highlighted-ips/1" \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

### Delete Highlighted IP

```bash
curl -X DELETE "http://localhost:3000/highlighted-ips/1"
```

### Get Highlighted IP Activity

```bash
curl "http://localhost:3000/highlighted-ips/activity"
```

### Get Highlighted IP Activity with Pagination

```bash
curl "http://localhost:3000/highlighted-ips/activity?page=1&limit=5"
```

## Troubleshooting

### PostgreSQL Connection Error

Ensure PostgreSQL is running:

```bash
docker-compose ps
docker-compose logs rdbms
```

### Elasticsearch Connection Error

Ensure Elasticsearch is running and healthy:

```bash
curl http://localhost:9200/_cluster/health
```

### Migration Errors

Ensure PostgreSQL is running and accessible with the configured credentials.

## Stopping Services

```bash
docker-compose down
```

To remove all data:

```bash
docker-compose down -v
```
