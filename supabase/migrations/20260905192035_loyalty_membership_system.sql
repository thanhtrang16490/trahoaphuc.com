begin;

create table if not exists public.loyalty_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  lifetime_earned integer not null default 0 check (lifetime_earned >= 0),
  lifetime_redeemed integer not null default 0 check (lifetime_redeemed >= 0),
  tier text not null default 'new' check (tier in ('new', 'member', 'gold')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null check (points <> 0),
  balance_after integer not null check (balance_after >= 0),
  transaction_type text not null check (transaction_type in ('earn', 'redeem', 'adjust', 'expire')),
  reference_type text not null default '',
  reference_id uuid,
  description text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists loyalty_transactions_user_created_idx on public.loyalty_transactions (user_id, created_at desc);
create unique index if not exists loyalty_transactions_order_earn_idx on public.loyalty_transactions (reference_id) where transaction_type = 'earn' and reference_type = 'order';

create table if not exists public.loyalty_rewards (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null default '',
  points_cost integer not null check (points_cost > 0),
  reward_type text not null default 'coupon' check (reward_type in ('coupon', 'gift')),
  coupon_code text,
  stock integer check (stock is null or stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.loyalty_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_id uuid not null references public.loyalty_rewards(id) on delete restrict,
  transaction_id uuid not null unique references public.loyalty_transactions(id) on delete restrict,
  redemption_code text not null unique,
  status text not null default 'issued' check (status in ('issued', 'used', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  used_at timestamptz
);

create index if not exists loyalty_redemptions_user_created_idx on public.loyalty_redemptions (user_id, created_at desc);

create or replace function public.loyalty_tier_for_points(points integer)
returns text
language sql
immutable
set search_path = public
as $$
  select case when points >= 3000 then 'gold' when points >= 1000 then 'member' else 'new' end;
$$;

create or replace function public.ensure_loyalty_account()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.loyalty_accounts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists profiles_create_loyalty_account on public.profiles;
create trigger profiles_create_loyalty_account
after insert on public.profiles
for each row execute function public.ensure_loyalty_account();

create or replace function public.award_order_points(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_points integer;
  v_balance integer;
  v_transaction_id uuid;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.customer_id is null or v_order.status <> 'delivered' then
    return jsonb_build_object('awarded', false, 'points', 0);
  end if;

  if exists (select 1 from public.loyalty_transactions where reference_type = 'order' and reference_id = p_order_id and transaction_type = 'earn') then
    return jsonb_build_object('awarded', false, 'points', 0);
  end if;

  v_points := floor(greatest(v_order.total_vnd, 0) / 1000.0)::integer;
  if v_points <= 0 then
    return jsonb_build_object('awarded', false, 'points', 0);
  end if;

  insert into public.loyalty_accounts (user_id)
  values (v_order.customer_id)
  on conflict (user_id) do nothing;

  select points_balance + v_points into v_balance from public.loyalty_accounts where user_id = v_order.customer_id for update;
  update public.loyalty_accounts
  set points_balance = v_balance,
      lifetime_earned = lifetime_earned + v_points,
      tier = public.loyalty_tier_for_points(points_balance + v_points),
      updated_at = timezone('utc', now())
  where user_id = v_order.customer_id;

  insert into public.loyalty_transactions (user_id, points, balance_after, transaction_type, reference_type, reference_id, description)
  values (v_order.customer_id, v_points, v_balance, 'earn', 'order', p_order_id, 'Tích điểm từ đơn hàng ' || v_order.order_number)
  returning id into v_transaction_id;

  return jsonb_build_object('awarded', true, 'points', v_points, 'transaction_id', v_transaction_id);
end;
$$;

create or replace function public.redeem_loyalty_reward(p_user_id uuid, p_reward_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reward public.loyalty_rewards%rowtype;
  v_account public.loyalty_accounts%rowtype;
  v_balance integer;
  v_transaction_id uuid;
  v_redemption_code text;
begin
  if p_user_id is null then raise exception 'LOYALTY_USER_REQUIRED'; end if;
  select * into v_reward from public.loyalty_rewards where id = p_reward_id and is_active for update;
  if not found then raise exception 'LOYALTY_REWARD_NOT_FOUND'; end if;
  if v_reward.stock is not null and v_reward.stock <= 0 then raise exception 'LOYALTY_REWARD_EXHAUSTED'; end if;

  insert into public.loyalty_accounts (user_id) values (p_user_id) on conflict (user_id) do nothing;
  select * into v_account from public.loyalty_accounts where user_id = p_user_id for update;
  if v_account.points_balance < v_reward.points_cost then raise exception 'LOYALTY_POINTS_INSUFFICIENT'; end if;
  v_balance := v_account.points_balance - v_reward.points_cost;
  v_redemption_code := 'HP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  update public.loyalty_accounts
  set points_balance = v_balance,
      lifetime_redeemed = lifetime_redeemed + v_reward.points_cost,
      tier = public.loyalty_tier_for_points(lifetime_earned),
      updated_at = timezone('utc', now())
  where user_id = p_user_id;

  insert into public.loyalty_transactions (user_id, points, balance_after, transaction_type, reference_type, description)
  values (p_user_id, -v_reward.points_cost, v_balance, 'redeem', 'reward', v_reward.id, 'Đổi ' || v_reward.title)
  returning id into v_transaction_id;
  insert into public.loyalty_redemptions (user_id, reward_id, transaction_id, redemption_code)
  values (p_user_id, v_reward.id, v_transaction_id, v_redemption_code);
  if v_reward.stock is not null then update public.loyalty_rewards set stock = stock - 1 where id = v_reward.id; end if;
  return jsonb_build_object('redemption_code', v_redemption_code, 'points_spent', v_reward.points_cost, 'balance', v_balance, 'title', v_reward.title, 'coupon_code', v_reward.coupon_code);
end;
$$;

create or replace function public.handle_order_loyalty_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'delivered' and old.status is distinct from 'delivered' then
    perform public.award_order_points(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists orders_award_loyalty_points on public.orders;
create trigger orders_award_loyalty_points
after update of status on public.orders
for each row execute function public.handle_order_loyalty_points();

insert into public.loyalty_accounts (user_id)
select id from public.profiles on conflict (user_id) do nothing;

insert into public.loyalty_rewards (code, title, description, points_cost, reward_type, coupon_code)
values
  ('REWARD_HOAPHUC5', 'Giảm 5%', 'Voucher giảm 5% cho đơn hàng tiếp theo.', 500, 'coupon', 'HOAPHUC5'),
  ('REWARD_FREESHIP200', 'Miễn phí vận chuyển', 'Áp dụng cho đơn từ 200.000đ.', 1500, 'coupon', 'FREESHIP200'),
  ('REWARD_HOAPHUC100', 'Giảm 100.000đ', 'Voucher giảm 100.000đ cho đơn từ 500.000đ.', 1000, 'coupon', 'HOAPHUC100')
on conflict (code) do update set
  title = excluded.title,
  description = excluded.description,
  points_cost = excluded.points_cost,
  coupon_code = excluded.coupon_code,
  is_active = true;

alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.loyalty_redemptions enable row level security;

create policy "Users can read own loyalty account" on public.loyalty_accounts for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can read own loyalty transactions" on public.loyalty_transactions for select to authenticated using ((select auth.uid()) = user_id);
create policy "Public can read active loyalty rewards" on public.loyalty_rewards for select to anon, authenticated using (is_active);
create policy "Users can read own loyalty redemptions" on public.loyalty_redemptions for select to authenticated using ((select auth.uid()) = user_id);

grant select on public.loyalty_accounts, public.loyalty_transactions, public.loyalty_rewards, public.loyalty_redemptions to authenticated;
grant select on public.loyalty_rewards to anon;
revoke all on function public.loyalty_tier_for_points(integer), public.ensure_loyalty_account(), public.award_order_points(uuid), public.redeem_loyalty_reward(uuid, uuid) from public, anon, authenticated;
grant execute on function public.redeem_loyalty_reward(uuid, uuid) to service_role;

commit;
