-- migrate:up

-- Function to get all highlighted IPs
CREATE OR REPLACE FUNCTION fn_get_highlighted_ips()
RETURNS TABLE (
    id INTEGER,
    ip_address VARCHAR,
    label VARCHAR,
    description TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT h.id, h.ip_address, h.label, h.description, h.is_active, h.created_at, h.updated_at
    FROM highlighted_ips h
    ORDER BY h.created_at DESC;
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_get_highlighted_ips();
