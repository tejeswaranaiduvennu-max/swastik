-- Add a free-text "sizes" field to products (shown as chips on the catalog card,
-- editable from the admin Products manager). Safe to run on existing databases.
alter table public.products add column if not exists sizes text;
