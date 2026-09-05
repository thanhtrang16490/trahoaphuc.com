begin;

create or replace function public.adjust_loyalty_points(
  p_user_id uuid,
  p_points integer,
  p_description text default 'Điều chỉnh điểm bởi quản trị viên'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.loyalty_accounts%rowtype;
  v_balance integer;
  v_transaction_id uuid;
begin
  if p_user_id is null or p_points is null or p_points = 0 then
    raise exception 'LOYALTY_ADJUSTMENT_INVALID';
  end if;

  insert into public.loyalty_accounts (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select * into v_account
  from public.loyalty_accounts
  where user_id = p_user_id
  for update;

  v_balance := v_account.points_balance + p_points;
  if v_balance < 0 then raise exception 'LOYALTY_BALANCE_NEGATIVE'; end if;

  update public.loyalty_accounts
  set points_balance = v_balance,
      lifetime_earned = greatest(0, lifetime_earned + greatest(p_points, 0)),
      lifetime_redeemed = greatest(0, lifetime_redeemed + greatest(-p_points, 0)),
      tier = public.loyalty_tier_for_points(greatest(0, lifetime_earned + greatest(p_points, 0))),
      updated_at = timezone('utc', now())
  where user_id = p_user_id;

  insert into public.loyalty_transactions (user_id, points, balance_after, transaction_type, reference_type, description)
  values (p_user_id, p_points, v_balance, 'adjust', 'admin', coalesce(nullif(trim(p_description), ''), 'Điều chỉnh điểm bởi quản trị viên'))
  returning id into v_transaction_id;

  return jsonb_build_object('user_id', p_user_id, 'points', p_points, 'balance', v_balance, 'transaction_id', v_transaction_id);
end;
$$;

revoke all on function public.adjust_loyalty_points(uuid, integer, text) from public, anon, authenticated;

commit;
