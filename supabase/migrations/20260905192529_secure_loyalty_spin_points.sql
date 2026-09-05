begin;

create or replace function public.award_spin_points(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_points constant integer := 100;
begin
  if p_user_id is null then raise exception 'LOYALTY_USER_REQUIRED'; end if;
  if exists (
    select 1 from public.loyalty_transactions
    where user_id = p_user_id and transaction_type = 'earn' and reference_type = 'spin'
      and created_at >= date_trunc('day', timezone('utc', now()))
  ) then
    raise exception 'LOYALTY_SPIN_LIMIT';
  end if;

  insert into public.loyalty_accounts (user_id) values (p_user_id) on conflict (user_id) do nothing;
  select points_balance + v_points into v_balance from public.loyalty_accounts where user_id = p_user_id for update;
  update public.loyalty_accounts
  set points_balance = v_balance,
      lifetime_earned = lifetime_earned + v_points,
      tier = public.loyalty_tier_for_points(lifetime_earned + v_points),
      updated_at = timezone('utc', now())
  where user_id = p_user_id;
  insert into public.loyalty_transactions (user_id, points, balance_after, transaction_type, reference_type, description)
  values (p_user_id, v_points, v_balance, 'earn', 'spin', 'Điểm thưởng từ vòng quay may mắn');
  return jsonb_build_object('points', v_points, 'balance', v_balance);
end;
$$;

revoke all on function public.award_spin_points(uuid) from public, anon, authenticated;
grant execute on function public.award_spin_points(uuid) to service_role;

commit;
