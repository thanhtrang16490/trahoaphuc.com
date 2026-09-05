begin;

create table if not exists public.zalo_identities (
  zalo_user_id text primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now())
);

create index if not exists zalo_identities_user_id_idx on public.zalo_identities (user_id);

drop trigger if exists zalo_identities_set_updated_at on public.zalo_identities;
create trigger zalo_identities_set_updated_at
before update on public.zalo_identities
for each row execute function public.set_updated_at();

alter table public.zalo_identities enable row level security;

revoke all on public.zalo_identities from anon, authenticated;

commit;
