begin;

create index if not exists order_items_product_id_idx
  on public.order_items (product_id);

drop policy if exists "Users can read their own orders" on public.orders;
create policy "Users can read their own orders"
on public.orders
for select
to authenticated
using ((select auth.uid()) = customer_id);

drop policy if exists "Users can read items from their own orders" on public.order_items;
create policy "Users can read items from their own orders"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.customer_id = (select auth.uid())
  )
);

revoke all on function public.rls_auto_enable() from public, anon, authenticated;

commit;
