begin;

create or replace function public.cancel_order(
  p_order_id uuid,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item record;
begin
  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if p_customer_id is not null and v_order.customer_id is distinct from p_customer_id then
    raise exception 'ORDER_FORBIDDEN';
  end if;

  if v_order.status not in ('pending', 'confirmed') or v_order.payment_status <> 'pending' then
    raise exception 'ORDER_CANNOT_CANCEL';
  end if;

  for v_item in
    select product_id, quantity
    from public.order_items
    where order_id = v_order.id
  loop
    update public.products
    set stock_quantity = stock_quantity + v_item.quantity
    where id = v_item.product_id;
  end loop;

  update public.orders
  set status = 'cancelled'
  where id = v_order.id;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'status', 'cancelled',
    'payment_status', v_order.payment_status,
    'total_vnd', v_order.total_vnd,
    'currency', v_order.currency
  );
end;
$$;

revoke all on function public.cancel_order(uuid, uuid) from public, anon, authenticated;
grant execute on function public.cancel_order(uuid, uuid) to service_role;

commit;
