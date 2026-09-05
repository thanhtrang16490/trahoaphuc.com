begin;

alter table public.orders
  add column if not exists shipping_provider text not null default '',
  add column if not exists tracking_code text not null default '',
  add column if not exists paid_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists cancelled_at timestamptz;

create index if not exists orders_tracking_code_idx on public.orders (tracking_code) where tracking_code <> '';

create table if not exists public.dealer_product_prices (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealer_profiles(user_id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price_vnd bigint not null check (price_vnd > 0),
  min_quantity integer not null default 1 check (min_quantity > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (dealer_id, product_id, min_quantity)
);

create index if not exists dealer_product_prices_dealer_idx on public.dealer_product_prices (dealer_id, is_active);
alter table public.dealer_product_prices enable row level security;

create table if not exists public.order_audit_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  from_status text,
  to_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_audit_logs_order_created_idx on public.order_audit_logs (order_id, created_at desc);
alter table public.order_audit_logs enable row level security;

create or replace function public.set_order_operation_timestamps()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.payment_status = 'paid' and old.payment_status is distinct from 'paid' then new.paid_at := coalesce(new.paid_at, timezone('utc', now())); end if;
  if new.status = 'shipping' and old.status is distinct from 'shipping' then new.shipped_at := coalesce(new.shipped_at, timezone('utc', now())); end if;
  if new.status = 'delivered' and old.status is distinct from 'delivered' then new.delivered_at := coalesce(new.delivered_at, timezone('utc', now())); end if;
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then new.cancelled_at := coalesce(new.cancelled_at, timezone('utc', now())); end if;
  return new;
end;
$$;

drop trigger if exists orders_set_operation_timestamps on public.orders;
create trigger orders_set_operation_timestamps
before update on public.orders
for each row execute function public.set_order_operation_timestamps();

create or replace function public.log_order_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status
     or old.payment_status is distinct from new.payment_status
     or old.tracking_code is distinct from new.tracking_code
     or old.shipping_provider is distinct from new.shipping_provider
     or old.dealer_commission_status is distinct from new.dealer_commission_status then
    insert into public.order_audit_logs (order_id, actor_id, action, from_status, to_status, metadata)
    values (new.id, auth.uid(), 'order_updated', old.status, new.status,
      jsonb_build_object('payment_status', new.payment_status, 'tracking_code', new.tracking_code, 'shipping_provider', new.shipping_provider, 'dealer_commission_status', new.dealer_commission_status));
  end if;
  return new;
end;
$$;

drop trigger if exists orders_log_admin_change on public.orders;
create trigger orders_log_admin_change
after update on public.orders
for each row execute function public.log_order_admin_change();

revoke all on function public.set_order_operation_timestamps() from public, anon, authenticated;
revoke all on function public.log_order_admin_change() from public, anon, authenticated;

commit;
