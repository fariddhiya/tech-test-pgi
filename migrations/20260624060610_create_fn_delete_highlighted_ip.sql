-- migrate:up

-- Function to delete a highlighted IP
CREATE OR REPLACE FUNCTION fn_delete_highlighted_ip(
    in_id INTEGER
)
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
    DELETE FROM highlighted_ips h
    WHERE h.id = in_id
    RETURNING h.id, h.ip_address, h.label, h.description, h.is_active, h.created_at, h.updated_at;
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_delete_highlighted_ip(INTEGER);