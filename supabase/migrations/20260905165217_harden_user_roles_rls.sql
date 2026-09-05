begin;

drop policy if exists "Users can read own role" on public.user_roles;
create policy "Users can read own role" on public.user_roles
for select to authenticated using ((select auth.uid()) = user_id);

grant select on public.user_roles to authenticated;

commit;
