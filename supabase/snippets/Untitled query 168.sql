select grantee, privilege_type
from information_schema.role_table_grants
where table_name = 'testimonials' and grantee = 'service_role';