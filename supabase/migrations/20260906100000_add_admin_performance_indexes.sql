begin;

create index if not exists news_posts_author_id_idx
  on public.news_posts (author_id);

create index if not exists user_roles_granted_by_idx
  on public.user_roles (granted_by);

commit;
