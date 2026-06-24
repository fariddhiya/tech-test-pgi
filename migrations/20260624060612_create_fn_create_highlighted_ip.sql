-- migrate:up

-- Function to create a highlighted IP
CREATE OR REPLACE FUNCTION fn_create_highlighted_ip(
    in_ip_address VARCHAR,
    in_label VARCHAR,
    in_description TEXT DEFAULT NULL
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
    INSERT INTO highlighted_ips (ip_address, label, description)
    VALUES (in_ip_address, in_label, in_description)
    RETURNING
        highlighted_ips.id,
        highlighted_ips.ip_address,
        highlighted_ips.label,
        highlighted_ips.description,
        highlighted_ips.is_active,
        highlighted_ips.created_at,
        highlighted_ips.updated_at;
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_create_highlighted_ip(VARCHAR, VARCHAR, TEXT);