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
