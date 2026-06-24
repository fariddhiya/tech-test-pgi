-- migrate:up
CREATE TABLE IF NOT EXISTS highlighted_ips (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR NOT NULL UNIQUE,
    label VARCHAR NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL
);

-- migrate:down
DROP TABLE IF EXISTS highlighted_ips;
