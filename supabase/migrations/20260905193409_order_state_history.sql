begin;

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text not null default '',
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_status_history_order_created_idx on public.order_status_history (order_id, created_at desc);
alter table public.order_status_history enable row level security;
create policy "Users can read own order status history" on public.order_status_history for select to authenticated using (exists (select 1 from public.orders where orders.id = order_status_history.order_id and orders.customer_id = (select auth.uid())));
grant select on public.order_status_history to authenticated;

create or replace function public.validate_order_status_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean := false;
begin
  if new.status is not distinct from old.status then return new; end if;
  allowed := case old.status
    when 'pending' then new.status in ('confirmed', 'cancelled')
    when 'confirmed' then new.status in ('packing', 'cancelled')
    when 'packing' then new.status in ('shipping', 'cancelled')
    when 'shipping' then new.status = 'delivered'
    when 'delivered' then false
    when 'cancelled' then false
    else false
  end;
  if not allowed then raise exception 'ORDER_STATUS_TRANSITION_INVALID'; end if;
  insert into public.order_status_history (order_id, from_status, to_status, changed_by)
  values (new.id, old.status, new.status, auth.uid());
  return new;
end;
$$;

drop trigger if exists orders_validate_status_transition on public.orders;
create trigger orders_validate_status_transition
before update of status on public.orders
for each row execute function public.validate_order_status_transition();

insert into public.order_status_history (order_id, from_status, to_status, note, created_at)
select id, null, status, 'Trạng thái ban đầu', created_at from public.orders
where not exists (select 1 from public.order_status_history h where h.order_id = orders.id);

revoke all on function public.validate_order_status_transition() from public, anon, authenticated;

commit;
