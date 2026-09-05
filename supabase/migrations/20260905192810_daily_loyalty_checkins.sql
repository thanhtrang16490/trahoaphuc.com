begin;

create table if not exists public.loyalty_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  streak_days integer not null check (streak_days > 0),
  points integer not null check (points > 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, checkin_date)
);

create index if not exists loyalty_checkins_user_date_idx on public.loyalty_checkins (user_id, checkin_date desc);
alter table public.loyalty_checkins enable row level security;
create policy "Users can read own loyalty checkins" on public.loyalty_checkins for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.loyalty_checkins to authenticated;

create or replace function public.claim_daily_loyalty_checkin(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := timezone('Asia/Ho_Chi_Minh', now())::date;
  v_last_date date;
  v_streak integer;
  v_points integer;
  v_balance integer;
  v_checkin_id uuid;
begin
  if p_user_id is null then raise exception 'LOYALTY_USER_REQUIRED'; end if;
  insert into public.loyalty_accounts (user_id) values (p_user_id) on conflict (user_id) do nothing;
  select points_balance into v_balance from public.loyalty_accounts where user_id = p_user_id for update;
  if exists (select 1 from public.loyalty_checkins where user_id = p_user_id and checkin_date = v_today) then
    raise exception 'LOYALTY_CHECKIN_CLAIMED';
  end if;

  select checkin_date, streak_days into v_last_date, v_streak
  from public.loyalty_checkins where user_id = p_user_id order by checkin_date desc limit 1;
  if v_last_date = v_today - 1 then v_streak := coalesce(v_streak, 0) + 1; else v_streak := 1; end if;
  v_points := least(20 + ((v_streak - 1) * 5), 50);
  v_balance := v_balance + v_points;

  insert into public.loyalty_checkins (user_id, checkin_date, streak_days, points)
  values (p_user_id, v_today, v_streak, v_points) returning id into v_checkin_id;
  update public.loyalty_accounts set points_balance = v_balance, lifetime_earned = lifetime_earned + v_points, tier = public.loyalty_tier_for_points(lifetime_earned + v_points), updated_at = timezone('utc', now()) where user_id = p_user_id;
  insert into public.loyalty_transactions (user_id, points, balance_after, transaction_type, reference_type, reference_id, description)
  values (p_user_id, v_points, v_balance, 'earn', 'checkin', v_checkin_id, 'Điểm danh ngày thứ ' || v_streak);
  return jsonb_build_object('streak_days', v_streak, 'points', v_points, 'balance', v_balance, 'checkin_date', v_today);
end;
$$;

revoke all on function public.claim_daily_loyalty_checkin(uuid) from public, anon, authenticated;
grant execute on function public.claim_daily_loyalty_checkin(uuid) to service_role;

commit;
