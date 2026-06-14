-- Add ip_hash for per-IP rate limiting on contact form submissions.
-- Stored as SHA-256 hex — never the raw IP.
alter table contact_submissions add column ip_hash text;
