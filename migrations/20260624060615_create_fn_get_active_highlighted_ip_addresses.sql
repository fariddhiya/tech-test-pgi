-- migrate:up

-- Function to get active highlighted IP addresses
CREATE OR REPLACE FUNCTION fn_get_active_highlighted_ip_addresses()
RETURNS TABLE (
    ip_address VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT h.ip_address
    FROM highlighted_ips h
    WHERE h.is_active = TRUE;
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_get_active_highlighted_ip_addresses();
