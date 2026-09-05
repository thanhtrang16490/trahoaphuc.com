begin;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  area text not null default '',
  business_type text not null default '',
  scale text not null default '',
  product_interest text not null default '',
  sales_channel text not null default '',
  message text not null default '',
  source text not null default 'agent_signup',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'discarded')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_status_created_idx on public.leads (status, created_at desc);
alter table public.leads enable row level security;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

revoke all on public.leads from public, anon, authenticated;
grant select, insert, update, delete on public.leads to service_role;

commit;
