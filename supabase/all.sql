-- ============================================================
-- Swastik Polymers — initial schema, RLS, triggers, seed
-- Run in Supabase SQL editor or via `supabase db push`.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- enums ----------
do $$ begin
  create type lead_status as enum
    ('New','Contacted','Follow-up Required','Quotation Sent','Converted','Rejected');
exception when duplicate_object then null; end $$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ---------- leads ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text,
  phone text not null,
  whatsapp text,
  email text,
  customer_type text not null,
  inquiry_type text not null,
  products text[] not null default '{}',
  quantity integer not null,
  requirements text,
  preferred_contact text not null,
  status lead_status not null default 'New',
  internal_notes text,
  follow_up_date date,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_quantity_min check (quantity >= 100)
);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_phone_idx on public.leads(phone);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  category text not null,
  image_url text,
  sizes text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- business_settings (single row) ----------
create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  proprietor_name text not null,
  phone text not null,
  whatsapp text not null,
  email text,
  address text not null,
  gstin text not null,
  minimum_order_quantity integer not null default 100,
  hero_heading text not null,
  business_description text not null,
  logo_url text,
  updated_at timestamptz not null default now()
);

-- ---------- lead_activity ----------
create table if not exists public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create index if not exists lead_activity_lead_idx on public.lead_activity(lead_id);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
drop trigger if exists settings_updated_at on public.business_settings;
create trigger settings_updated_at before update on public.business_settings
  for each row execute function public.set_updated_at();

-- ---------- helper: is current user an admin ----------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ---------- auto-create profile on signup (admins provisioned manually) ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.leads enable row level security;
alter table public.products enable row level security;
alter table public.business_settings enable row level security;
alter table public.lead_activity enable row level security;
alter table public.profiles enable row level security;

-- leads: public may INSERT (submit inquiry) but never SELECT/UPDATE/DELETE.
drop policy if exists leads_insert_public on public.leads;
create policy leads_insert_public on public.leads
  for insert to anon, authenticated with check (true);

drop policy if exists leads_admin_all on public.leads;
create policy leads_admin_all on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- products: public reads only ACTIVE products; admins manage all.
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- business_settings: public reads; admins write.
drop policy if exists settings_public_read on public.business_settings;
create policy settings_public_read on public.business_settings
  for select to anon, authenticated using (true);

drop policy if exists settings_admin_write on public.business_settings;
create policy settings_admin_write on public.business_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- lead_activity + profiles: admins only.
drop policy if exists activity_admin_all on public.lead_activity;
create policy activity_admin_all on public.lead_activity
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
-- ============================================================
-- Swastik Polymers — seed: business_settings (1 row) + 12 products.
-- Safe to re-run (idempotent via unique slug / single settings row).
-- ============================================================

insert into public.business_settings
  (business_name, proprietor_name, phone, whatsapp, email, address, gstin,
   minimum_order_quantity, hero_heading, business_description, logo_url)
select
  'Swastik Polymers', 'Chintha Achutch', '9866596129', '919866596129', null,
  '8-18-303 Industrial Estate, V.T. Agraharam, Vizianagaram, Andhra Pradesh.',
  '3EDPFA6603F1ZW', 100,
  'Reliable PVC Solutions for Every Electrical Need.',
  'Swastik Polymers — Manufacturers of PVC Electrical Pipes & Fittings and Suppliers of Garden Pipes.',
  null
where not exists (select 1 from public.business_settings);

insert into public.products (slug, name, description, category, image_url, is_featured, is_active) values
  ('pvc-junction-boxes','PVC Junction Boxes','Durable PVC junction boxes for safe, concealed electrical wiring connections.','PVC Electrical Products','/products/pvc-junction-boxes.svg',true,true),
  ('pvc-bends','PVC Bends','Smooth-radius PVC bends for clean conduit routing around corners.','PVC Electrical Products','/products/pvc-bends.svg',false,true),
  ('pvc-electrical-fittings','PVC Electrical Fittings','Complete range of couplers, connectors and accessories for conduit systems.','PVC Electrical Products','/products/pvc-electrical-fittings.svg',true,true),
  ('pvc-conduit-pipes','PVC Conduit Pipes','Rigid PVC conduit pipes engineered for reliable electrical cable protection.','PVC Electrical Products','/products/pvc-conduit-pipes.svg',true,true),
  ('flexible-hoses','Flexible Hoses','Flexible PVC hoses for adaptable wiring runs in tight installations.','PVC Electrical Products','/products/flexible-hoses.svg',false,true),
  ('nail-clamps','Nail Clamps','Nail clamps for quick, secure fastening of cables and conduit to surfaces.','Cable Management Products','/products/nail-clamps.svg',false,true),
  ('cable-ties','Cable Ties','Strong nylon cable ties for neat bundling and cable management.','Cable Management Products','/products/cable-ties.svg',false,true),
  ('modular-surface-boxes','Modular Surface Boxes','Surface-mount modular boxes compatible with standard modular switch plates.','Electrical Boxes and Accessories','/products/modular-surface-boxes.svg',false,true),
  ('modular-gang-boxes','Modular Gang Boxes','Multi-gang modular boxes for flush-mount switch and socket assemblies.','Electrical Boxes and Accessories','/products/modular-gang-boxes.svg',false,true),
  ('metal-boxes','Metal Boxes','Sturdy metal concealed boxes for durable switchboard installations.','Electrical Boxes and Accessories','/products/metal-boxes.svg',false,true),
  ('black-star-screws','Black Star Screws','Black star-head screws for fixing switch plates and electrical accessories.','Electrical Boxes and Accessories','/products/black-star-screws.svg',false,true),
  ('garden-pipes','Garden Pipes','Flexible garden pipes supplied for irrigation and general water use.','Garden Products','/products/garden-pipes.svg',true,true)
on conflict (slug) do nothing;
-- ============================================================
-- Public bucket for product images + admin-only write policy.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can read (public bucket); only admins can upload/modify/delete.
drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists product_images_admin_write on storage.objects;
create policy product_images_admin_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
