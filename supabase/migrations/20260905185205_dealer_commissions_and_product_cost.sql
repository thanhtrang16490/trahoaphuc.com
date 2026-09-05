begin;

alter table public.product_prices
  add column if not exists original_price_vnd bigint;

update public.product_prices
set original_price_vnd = price_vnd
where original_price_vnd is null;

alter table public.product_prices
  alter column original_price_vnd set default 0,
  alter column original_price_vnd set not null;

alter table public.product_prices
  drop constraint if exists product_prices_original_price_check;

alter table public.product_prices
  add constraint product_prices_original_price_check check (original_price_vnd >= 0);

alter table public.dealer_profiles
  add column if not exists commission_rate numeric(5, 2) not null default 0;

alter table public.dealer_profiles
  drop constraint if exists dealer_profiles_commission_rate_check;

alter table public.dealer_profiles
  add constraint dealer_profiles_commission_rate_check check (commission_rate >= 0 and commission_rate <= 100);

alter table public.orders
  add column if not exists dealer_id uuid references auth.users(id) on delete set null,
  add column if not exists dealer_commission_rate numeric(5, 2) not null default 0,
  add column if not exists dealer_commission_vnd bigint not null default 0,
  add column if not exists dealer_commission_status text not null default 'pending';

alter table public.orders
  drop constraint if exists orders_dealer_commission_rate_check,
  drop constraint if exists orders_dealer_commission_vnd_check,
  drop constraint if exists orders_dealer_commission_status_check;

alter table public.orders
  add constraint orders_dealer_commission_rate_check check (dealer_commission_rate >= 0 and dealer_commission_rate <= 100),
  add constraint orders_dealer_commission_vnd_check check (dealer_commission_vnd >= 0),
  add constraint orders_dealer_commission_status_check check (dealer_commission_status in ('pending', 'approved', 'paid', 'cancelled'));

create index if not exists orders_dealer_created_idx on public.orders (dealer_id, created_at desc);
create index if not exists orders_dealer_commission_status_idx on public.orders (dealer_commission_status, created_at desc);

create or replace function public.set_dealer_commission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rate numeric(5, 2);
begin
  if new.customer_id is null then
    return new;
  end if;

  select dp.commission_rate
  into v_rate
  from public.dealer_profiles dp
  join public.user_roles ur on ur.user_id = dp.user_id
  where dp.user_id = new.customer_id
    and ur.role = 'dealer'
    and dp.status = 'active';

  if v_rate is not null then
    new.dealer_id = new.customer_id;
    new.dealer_commission_rate = v_rate;
    new.dealer_commission_vnd = round(coalesce(new.subtotal_vnd, 0) * v_rate / 100)::bigint;
  end if;

  return new;
end;
$$;

drop trigger if exists orders_set_dealer_commission on public.orders;
create trigger orders_set_dealer_commission
before insert on public.orders
for each row execute function public.set_dealer_commission();

revoke all on function public.set_dealer_commission() from public, anon, authenticated;

update public.orders o
set dealer_id = o.customer_id,
    dealer_commission_rate = dp.commission_rate,
    dealer_commission_vnd = round(o.subtotal_vnd * dp.commission_rate / 100)::bigint
from public.dealer_profiles dp
join public.user_roles ur on ur.user_id = dp.user_id and ur.role = 'dealer'
where o.customer_id = dp.user_id
  and dp.status = 'active'
  and dp.commission_rate > 0
  and o.dealer_id is null;

commit;
