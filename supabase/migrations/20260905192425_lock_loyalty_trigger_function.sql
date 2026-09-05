begin;

revoke all on function public.handle_order_loyalty_points() from public, anon, authenticated;

commit;
