begin;

alter table public.products add column if not exists low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  package_label text not null default '',
  price_vnd bigint not null check (price_vnd > 0),
  original_price_vnd bigint not null check (original_price_vnd >= price_vnd),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index if not exists product_variants_product_active_idx on public.product_variants (product_id, is_active);
drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
alter table public.product_variants enable row level security;
drop policy if exists "Public can read active product variants" on public.product_variants;
create policy "Public can read active product variants" on public.product_variants for select to anon, authenticated using (is_active and exists (select 1 from public.products where products.id = product_variants.product_id and products.is_active));
grant select on public.product_variants to anon, authenticated;

create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  address text not null default '',
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create table if not exists public.inventory_levels (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0 and reserved_quantity <= quantity),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (warehouse_id, product_id)
);
create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete restrict,
  movement_type text not null check (movement_type in ('inbound', 'outbound', 'adjustment', 'reserve', 'release')),
  quantity integer not null check (quantity <> 0),
  reference_type text not null default '',
  reference_id uuid,
  note text not null default '',
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists inventory_movements_product_created_idx on public.inventory_movements (product_id, created_at desc);
alter table public.warehouses enable row level security;
alter table public.inventory_levels enable row level security;
alter table public.inventory_movements enable row level security;

create table if not exists public.product_price_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  old_price_vnd bigint not null,
  old_original_price_vnd bigint not null,
  new_price_vnd bigint not null,
  new_original_price_vnd bigint not null,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists product_price_history_product_created_idx on public.product_price_history (product_id, created_at desc);
alter table public.product_price_history enable row level security;

create or replace function public.log_product_price_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.price_vnd is distinct from new.price_vnd or old.original_price_vnd is distinct from new.original_price_vnd then
    insert into public.product_price_history (product_id, old_price_vnd, old_original_price_vnd, new_price_vnd, new_original_price_vnd, actor_id)
    values (new.product_id, old.price_vnd, old.original_price_vnd, new.price_vnd, new.original_price_vnd, auth.uid());
  end if;
  return new;
end;
$$;
drop trigger if exists product_prices_log_change on public.product_prices;
create trigger product_prices_log_change after update on public.product_prices for each row execute function public.log_product_price_change();
revoke all on function public.log_product_price_change() from public, anon, authenticated;

insert into public.warehouses (code, name, is_default)
values ('MAIN', 'Kho Hòa Phúc', true)
on conflict (code) do nothing;

insert into public.inventory_levels (warehouse_id, product_id, quantity)
select w.id, p.id, p.stock_quantity
from public.warehouses w cross join public.products p
where w.code = 'MAIN'
on conflict (warehouse_id, product_id) do nothing;

commit;
