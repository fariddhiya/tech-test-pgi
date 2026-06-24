-- migrate:up

-- Function to get assets by host identifiers
CREATE OR REPLACE FUNCTION fn_get_assets_by_host_identifiers(
    in_host_identifiers VARCHAR[]
)
RETURNS TABLE (
    host_identifier_local VARCHAR,
    asset_name VARCHAR,
    department_owner VARCHAR,
    risk_level VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT a.host_identifier_local, a.asset_name, a.department_owner, a.risk_level
    FROM internal_infrastructure_assets a
    WHERE a.host_identifier_local = ANY(in_host_identifiers);
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_get_assets_by_host_identifiers(VARCHAR[]);
