-- migrate:up

-- Function to get asset target IPs based on department and risk filters
CREATE OR REPLACE FUNCTION fn_get_asset_target_ips(
    in_department VARCHAR DEFAULT NULL,
    in_risk VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    host_identifier_local VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT a.host_identifier_local
    FROM internal_infrastructure_assets a
    WHERE (in_department IS NULL OR a.department_owner ILIKE in_department)
      AND (in_risk IS NULL OR a.risk_level ILIKE in_risk);
END;
$$;

-- migrate:down
DROP FUNCTION IF EXISTS fn_get_asset_target_ips(VARCHAR, VARCHAR);
