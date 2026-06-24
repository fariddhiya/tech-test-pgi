-- migrate:up
CREATE TABLE IF NOT EXISTS internal_infrastructure_assets (
    id SERIAL PRIMARY KEY,
    asset_name VARCHAR NOT NULL,
    host_identifier_local VARCHAR NOT NULL,
    department_owner VARCHAR NOT NULL,
    risk_level VARCHAR NOT NULL
);

-- migrate:down
DROP TABLE IF EXISTS internal_infrastructure_assets;