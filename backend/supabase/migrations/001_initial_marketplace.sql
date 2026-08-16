create extension if not exists "pgcrypto";
create extension if not exists "postgis";

do $$ begin
  create type booking_status as enum ('requested', 'accepted', 'rejected', 'cancelled', 'on_the_way', 'in_progress', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_price_type as enum ('fixed', 'starting_from', 'range', 'quote_required');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_type as enum ('booking', 'delivery', 'quote');
exception when duplicate_object then null; end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  default_area text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  address_line text not null,
  area text not null,
  city text not null default 'Ibadan',
  state text not null default 'Oyo',
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null,
  parent_id uuid references categories(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  verification_status verification_status not null default 'unverified',
  average_rating numeric(3,2) not null default 0,
  review_count int not null default 0,
  completed_booking_count int not null default 0,
  phone text,
  email text,
  is_active boolean not null default true,
  accepts_bookings boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists business_locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  address text not null,
  area text not null,
  city text not null default 'Ibadan',
  state text not null default 'Oyo',
  latitude double precision not null,
  longitude double precision not null,
  geo_point geography(point, 4326) generated always as (st_setsrid(st_makepoint(longitude, latitude), 4326)::geography) stored,
  service_radius_km numeric(6,2) not null default 8,
  created_at timestamptz not null default now()
);

create table if not exists business_categories (
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (business_id, category_id)
);

create table if not exists business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  is_cover boolean not null default false
);

create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  unique (business_id, weekday)
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  price_type service_price_type not null default 'starting_from',
  price int,
  min_price int,
  max_price int,
  duration_minutes int,
  booking_type booking_type not null default 'booking',
  lead_time_hours int not null default 0,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (price is null or price >= 0),
  check (min_price is null or min_price >= 0),
  check (max_price is null or max_price >= 0)
);

create table if not exists service_availability (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  available_date date,
  start_time time,
  end_time time,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, business_id)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete restrict,
  service_id uuid not null references services(id) on delete restrict,
  address_id uuid references addresses(id) on delete set null,
  requested_date date not null,
  requested_time time not null,
  notes text,
  subtotal int not null default 0,
  service_fee int not null default 0,
  total int not null default 0,
  currency text not null default 'NGN',
  status booking_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  old_status booking_status,
  new_status booking_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade unique,
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, user_id, booking_id)
);

create table if not exists verification_records (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  type text not null,
  status verification_status not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists idx_business_locations_geo on business_locations using gist (geo_point);
create index if not exists idx_business_locations_area on business_locations (lower(area));
create unique index if not exists idx_business_locations_business_unique on business_locations (business_id);
create index if not exists idx_businesses_active_rating on businesses (is_active, average_rating desc);
create index if not exists idx_businesses_search on businesses using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' || coalesce(description,'')));
create index if not exists idx_services_business_active on services (business_id, is_active);
create index if not exists idx_bookings_user_status on bookings (user_id, status, created_at desc);
create index if not exists idx_booking_history_booking on booking_status_history (booking_id, created_at);
create index if not exists idx_reviews_business on reviews (business_id, created_at desc);

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles for each row execute function set_updated_at();
drop trigger if exists businesses_updated_at on businesses;
create trigger businesses_updated_at before update on businesses for each row execute function set_updated_at();
drop trigger if exists services_updated_at on services;
create trigger services_updated_at before update on services for each row execute function set_updated_at();
drop trigger if exists bookings_updated_at on bookings;
create trigger bookings_updated_at before update on bookings for each row execute function set_updated_at();
drop trigger if exists reviews_updated_at on reviews;
create trigger reviews_updated_at before update on reviews for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table addresses enable row level security;
alter table categories enable row level security;
alter table businesses enable row level security;
alter table business_locations enable row level security;
alter table business_categories enable row level security;
alter table business_images enable row level security;
alter table business_hours enable row level security;
alter table services enable row level security;
alter table service_availability enable row level security;
alter table favorites enable row level security;
alter table bookings enable row level security;
alter table booking_status_history enable row level security;
alter table reviews enable row level security;
alter table verification_records enable row level security;

drop policy if exists "profiles own read" on profiles;
create policy "profiles own read" on profiles for select using (auth.uid() = id);
drop policy if exists "profiles own write" on profiles;
create policy "profiles own write" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "addresses own" on addresses;
create policy "addresses own" on addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "categories public active" on categories;
create policy "categories public active" on categories for select using (is_active = true);
drop policy if exists "businesses public active" on businesses;
create policy "businesses public active" on businesses for select using (is_active = true);
drop policy if exists "business locations public active" on business_locations;
create policy "business locations public active" on business_locations for select using (exists (select 1 from businesses b where b.id = business_id and b.is_active = true));
drop policy if exists "business categories public active" on business_categories;
create policy "business categories public active" on business_categories for select using (exists (select 1 from businesses b where b.id = business_id and b.is_active = true));
drop policy if exists "business images public active" on business_images;
create policy "business images public active" on business_images for select using (exists (select 1 from businesses b where b.id = business_id and b.is_active = true));
drop policy if exists "business hours public active" on business_hours;
create policy "business hours public active" on business_hours for select using (exists (select 1 from businesses b where b.id = business_id and b.is_active = true));
drop policy if exists "services public active" on services;
create policy "services public active" on services for select using (is_active = true and exists (select 1 from businesses b where b.id = business_id and b.is_active = true));
drop policy if exists "availability public active" on service_availability;
create policy "availability public active" on service_availability for select using (exists (select 1 from services s join businesses b on b.id = s.business_id where s.id = service_id and s.is_active = true and b.is_active = true));

drop policy if exists "favorites own" on favorites;
create policy "favorites own" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "bookings own read" on bookings;
create policy "bookings own read" on bookings for select using (auth.uid() = user_id);
drop policy if exists "bookings own insert" on bookings;
create policy "bookings own insert" on bookings for insert with check (auth.uid() = user_id);
drop policy if exists "booking history own read" on booking_status_history;
create policy "booking history own read" on booking_status_history for select using (exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid()));

drop policy if exists "reviews public read" on reviews;
create policy "reviews public read" on reviews for select using (exists (select 1 from businesses b where b.id = business_id and b.is_active = true));
drop policy if exists "reviews own valid insert" on reviews;
create policy "reviews own valid insert" on reviews for insert with check (
  auth.uid() = user_id
  and exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid() and b.status = 'completed')
);

insert into storage.buckets (id, name, public)
values ('business-images', 'business-images', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;
