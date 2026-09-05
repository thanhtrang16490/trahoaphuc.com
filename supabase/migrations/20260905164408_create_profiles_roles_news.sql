begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  phone text not null default '',
  province text not null default '',
  account_type text not null default 'customer' check (account_type in ('customer', 'dealer')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'dealer', 'staff', 'editor', 'admin')),
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists user_roles_role_idx on public.user_roles (role);

create table if not exists public.dealer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  business_name text not null default '',
  area text not null default '',
  business_type text not null default '',
  discount_rate numeric(5, 2) not null default 0 check (discount_rate >= 0 and discount_rate <= 100),
  status text not null default 'pending' check (status in ('pending', 'active', 'paused', 'rejected')),
  note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists dealer_profiles_status_idx on public.dealer_profiles (status);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, province)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'province', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case when excluded.full_name <> '' then excluded.full_name else profiles.full_name end,
    phone = case when excluded.phone <> '' then excluded.phone else profiles.phone end,
    province = case when excluded.province <> '' then excluded.province else profiles.province end;

  insert into public.user_roles (user_id, role)
  values (new.id, 'customer')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

insert into public.profiles (id, email, full_name, phone, province)
select id, coalesce(email, ''), coalesce(raw_user_meta_data ->> 'name', ''), coalesce(raw_user_meta_data ->> 'phone', ''), coalesce(raw_user_meta_data ->> 'province', '')
from auth.users
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select id, 'customer'
from public.profiles
on conflict (user_id) do nothing;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  title text not null,
  excerpt text not null default '',
  category text not null default '',
  published_at date,
  read_time text not null default '',
  cover_image text not null default '',
  source_url text,
  source_name text,
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists news_posts_status_published_idx on public.news_posts (status, published_at desc);

drop trigger if exists news_posts_set_updated_at on public.news_posts;
create trigger news_posts_set_updated_at
before update on public.news_posts
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.dealer_profiles enable row level security;
alter table public.news_posts enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news" on public.news_posts
for select to anon, authenticated using (status = 'published');

grant select on public.news_posts to anon, authenticated;
grant select, update on public.profiles to authenticated;

drop policy if exists "Dealers can read own dealer profile" on public.dealer_profiles;
create policy "Dealers can read own dealer profile" on public.dealer_profiles
for select to authenticated using ((select auth.uid()) = user_id);

grant select on public.dealer_profiles to authenticated;

insert into public.news_posts (slug, title, excerpt, category, published_at, read_time, cover_image, source_url, source_name, content)
values
  ('tra-thao-moc-nen-uong-luc-nao', 'Trà thảo mộc nên uống lúc nào để cảm nhận hương vị rõ nhất?', 'Gợi ý thời điểm uống trà trong ngày để tận hưởng trọn vẹn hương vị và sự thư thái.', 'Trà thảo mộc', '2026-08-29', '4 phút đọc', '/products/duong-tam-an-nhien.jpg', 'https://www.facebook.com/nongsanhoaphucnb/posts/122114805099381663/', 'Facebook fanpage', '["Trà thảo mộc thường phù hợp vào những thời điểm cơ thể cần sự thư giãn nhẹ.", "Bạn có thể pha trà nóng để cảm nhận mùi thơm rõ hơn hoặc ủ lạnh để dùng trong ngày."]'::jsonb),
  ('cach-chon-tra-lam-qua-bieu', 'Cách chọn trà làm quà biếu vừa đẹp vừa tinh tế', 'Một vài tiêu chí đơn giản để chọn quà trà phù hợp cho dịp lễ, Tết hoặc thăm hỏi.', 'Quà biếu', '2026-08-28', '5 phút đọc', '/products/bat-bao-hoa-phuc.jpg', 'https://www.facebook.com/nongsanhoaphucnb/posts/122115934773381663/', 'Facebook fanpage', '["Quà biếu trà nên cân bằng giữa hình thức, hương vị và câu chuyện thương hiệu.", "Nên ưu tiên dòng trà có quy cách rõ ràng, dễ sử dụng và phù hợp nhiều đối tượng."]'::jsonb),
  ('vi-sao-nen-chon-san-pham-lam-qua-bieu', 'Vì sao sản phẩm nông sản sạch ngày càng được chọn làm quà biếu?', 'Những lý do khiến nông sản sạch, trà thảo mộc và đặc sản vùng miền trở thành quà biếu được yêu thích.', 'Xu hướng', '2026-08-27', '4 phút đọc', '/products/gao-lut-la-sen.jpg', 'https://www.facebook.com/nongsanhoaphucnb/posts/122116730565381663/', 'Facebook fanpage', '["Người nhận quà ngày càng quan tâm đến nguồn gốc và giá trị sử dụng.", "Trà thảo mộc, mật ong hay ngũ cốc vừa đẹp mắt vừa có thể dùng thường xuyên."]'::jsonb),
  ('hanh-trinh-cua-mot-goi-tra-hoa-phuc', 'Hành trình của một gói trà Hòa Phúc', 'Câu chuyện về sự tận tâm trong từng gói trà, từ tem thương hiệu tới cách đóng gói.', 'Câu chuyện thương hiệu', '2026-08-29', '4 phút đọc', '/products/duong-tam-an-nhien-box.jpg', 'https://www.facebook.com/nongsanhoaphucnb/posts/122115934773381663/', 'Facebook fanpage', '["Mỗi gói trà Hòa Phúc là lời hứa về chất lượng và sự tận tâm.", "Từng chi tiết được chăm chút để người nhận cảm thấy chỉn chu ngay từ lần mở hộp đầu tiên."]'::jsonb),
  ('mot-ngum-tra-thanh-cho-an-nhien-den', 'Một ngụm trà thanh, chờ an nhiên đến', 'Gợi ý nhịp thưởng trà chậm rãi để thư giãn sau ngày dài.', 'Lối sống', '2026-08-29', '4 phút đọc', '/products/thanh-nhiet-hoa-phuc.jpg', 'https://www.facebook.com/nongsanhoaphucnb/posts/122116317123381663/', 'Facebook fanpage', '["Có những lúc chỉ cần một ngụm trà thanh là đủ để đổi nhịp cho cả ngày dài.", "Thưởng trà chậm lại một chút để mùi hương và vị trà mở ra dần."]'::jsonb),
  ('thao-duoc-ngam-chan-hoa-phuc', 'Thảo dược ngâm chân Hòa Phúc - thư giãn sâu từ gốc', 'Bài viết giới thiệu sản phẩm ngâm chân thảo dược như một thói quen chăm sóc sau ngày dài.', 'Chăm sóc', '2026-08-29', '4 phút đọc', '/products/bat-bao-hoa-phuc.jpg', 'https://www.facebook.com/nongsanhoaphucnb/posts/122118330687381663/', 'Facebook fanpage', '["Ngâm chân cùng thảo dược là một thói quen đơn giản để thư giãn.", "Tinh thần của Hòa Phúc là giữ mọi thứ chân thật, mộc mạc và dễ hiểu."]'::jsonb)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  category = excluded.category,
  published_at = excluded.published_at,
  read_time = excluded.read_time,
  cover_image = excluded.cover_image,
  source_url = excluded.source_url,
  source_name = excluded.source_name,
  content = excluded.content,
  status = 'published';

commit;
