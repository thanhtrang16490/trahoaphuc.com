begin;

alter table public.orders
  add column if not exists recipient_name text not null default '',
  add column if not exists recipient_email text not null default '',
  add column if not exists recipient_phone text not null default '';

update public.orders
set recipient_name = customer_name,
    recipient_email = customer_email,
    recipient_phone = customer_phone
where recipient_name = '';

commit;
