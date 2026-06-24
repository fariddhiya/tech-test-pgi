-- migrate:up
-- Function to update a highlighted IP
CREATE OR REPLACE FUNCTION fn_update_highlighted_ip(
    in_id INTEGER,
    in_ip_address VARCHAR DEFAULT NULL,
    in_label VARCHAR DEFAULT NULL,
    in_description TEXT DEFAULT NULL,
    in_is_active BOOLEAN DEFAULT NULL
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
    UPDATE highlighted_ips
    SET
        ip_address = COALESCE(in_ip_address, highlighted_ips.ip_address),
        label = COALESCE(in_label, highlighted_ips.label),
        description = COALESCE(in_description, highlighted_ips.description),
        is_active = COALESCE(in_is_active, highlighted_ips.is_active),
        updated_at = NOW()
    WHERE highlighted_ips.id = in_id;

    RETURN QUERY
    SELECT h.id, h.ip_address, h.label, h.description, h.is_active, h.created_at, h.updated_at
    FROM highlighted_ips h
    WHERE h.id = in_id;
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_update_highlighted_ip(INTEGER, VARCHAR, VARCHAR, TEXT, BOOLEAN);
