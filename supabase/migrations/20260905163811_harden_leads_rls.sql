begin;

drop policy if exists "No public access to leads" on public.leads;
create policy "No public access to leads"
on public.leads
for all
to anon, authenticated
using (false)
with check (false);

commit;
