begin;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  category_id uuid not null references public.categories(id) on update cascade on delete restrict,
  name text not null,
  short_description text not null default '',
  long_description text not null default '',
  ingredients jsonb not null default '[]'::jsonb check (jsonb_typeof(ingredients) = 'array'),
  benefits jsonb not null default '[]'::jsonb check (jsonb_typeof(benefits) = 'array'),
  package_label text not null default '',
  image text not null default '',
  image_width integer not null default 1200 check (image_width > 0),
  image_height integer not null default 900 check (image_height > 0),
  box_image text not null default '',
  box_image_width integer not null default 1200 check (box_image_width > 0),
  box_image_height integer not null default 900 check (box_image_height > 0),
  origin text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on update cascade on delete cascade,
  price_vnd bigint not null check (price_vnd > 0),
  currency text not null default 'VND' check (currency = 'VND'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists categories_active_sort_order_idx
  on public.categories (is_active, sort_order, name);

create index if not exists products_category_active_sort_order_idx
  on public.products (category_id, is_active, sort_order, name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists product_prices_set_updated_at on public.product_prices;
create trigger product_prices_set_updated_at
before update on public.product_prices
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (is_active);

drop policy if exists "Public can read active product prices" on public.product_prices;
create policy "Public can read active product prices"
on public.product_prices
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_prices.product_id
      and products.is_active
  )
);

grant select on public.categories, public.products, public.product_prices to anon, authenticated;

insert into public.categories (slug, name, description, sort_order)
values
  ('tra-thao-moc', 'Trà thảo mộc', 'Nhóm trà thảo mộc thanh lành, dễ uống, phù hợp dùng hằng ngày và làm quà biếu.', 1),
  ('duong-sinh', 'Dưỡng sinh', 'Các sản phẩm hướng đến phong cách sống cân bằng, gọn vị và tinh tế.', 2),
  ('dac-san-vung-mien', 'Đặc sản vùng miền', 'Công thức gắn với Cúc Phương, Ninh Bình và cảm hứng bản địa Việt Nam.', 3)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true;

with product_seed (
  slug,
  name,
  category_slug,
  short_description,
  long_description,
  ingredients,
  benefits,
  package_label,
  image,
  image_width,
  image_height,
  box_image,
  box_image_width,
  box_image_height,
  origin,
  sort_order
) as (
  values
    (
      'tra-duong-tam-an-nhien',
      'Trà Dưỡng Tâm An Nhiên',
      'tra-thao-moc',
      'Hương vị thanh lành từ vùng đất Cố Đô, phối trộn thảo mộc tự nhiên, dịu nhẹ và cân bằng.',
      'Một công thức trà thảo mộc được phát triển để mang lại cảm giác thư thái, phù hợp cho nhịp sống hiện đại nhưng vẫn giữ tinh thần an nhiên của vùng nguyên liệu Việt Nam.',
      '["Lạc tiên", "thảo quyết minh", "lá nếp", "cỏ ngọt", "vỏ long nhãn", "hoa cúc"]'::jsonb,
      '["Hương vị dễ uống", "Phù hợp dùng mỗi ngày", "Tinh thần thư thái"]'::jsonb,
      'Hộp 30 túi lọc x 3g/túi',
      '/products/duong-tam-an-nhien.jpg',
      1402,
      1122,
      '/products/duong-tam-an-nhien-box.jpg',
      1562,
      1007,
      'Cúc Phương, Ninh Bình',
      1
    ),
    (
      'tra-thanh-nhiet-hoa-phuc',
      'Trà Thanh Nhiệt Hòa Phúc',
      'tra-thao-moc',
      'Sắc trà tươi mát, cân bằng giữa thảo mộc và hương núi rừng Việt Nam.',
      'Dành cho những khoảnh khắc cần làm dịu cơ thể và tinh thần, trà mang phong vị thanh mát với cấu trúc hương nhẹ, trong và sạch.',
      '["Diệp hạ châu", "cà gai leo", "kim ngân", "cỏ ngọt", "hoa hòe", "bồ công anh", "thảo quyết minh", "hồng chi"]'::jsonb,
      '["Cảm giác thanh nhẹ", "Hợp uống nóng hoặc lạnh", "Hương vị tự nhiên"]'::jsonb,
      'Hộp 30 túi lọc x 3.5g/túi',
      '/products/thanh-nhiet-hoa-phuc.jpg',
      1402,
      1122,
      '/products/thanh-nhiet-hoa-phuc.jpg',
      1402,
      1122,
      'Ninh Bình',
      2
    ),
    (
      'tra-gao-lut-la-sen',
      'Trà Gạo Lứt Lá Sen Hòa Phúc',
      'duong-sinh',
      'Lớp vị ngũ cốc thanh và hậu vị sen nhẹ, phù hợp cho lối sống lành mạnh.',
      'Kết hợp gạo lứt, lá sen và thảo mộc chọn lọc để tạo nên thức trà có chiều sâu vị giác, đậm cảm giác mộc mà vẫn thanh lịch.',
      '["Gạo lứt", "lá sen", "thảo quyết minh", "cỏ ngọt", "hoa hòe"]'::jsonb,
      '["Hậu vị dịu", "Dễ dùng hằng ngày", "Phù hợp phong cách sống cân bằng"]'::jsonb,
      'Hộp 30 túi lọc x 3g/túi',
      '/products/gao-lut-la-sen.jpg',
      1402,
      1122,
      '/products/gao-lut-la-sen-box.jpg',
      1578,
      1012,
      'Việt Nam',
      3
    ),
    (
      'tra-bat-bao-cuc-phuong',
      'Trà Bát Bảo Cúc Phương',
      'dac-san-vung-mien',
      'Công thức bát bảo truyền thống theo ngôn ngữ hiện đại, cân bằng và giàu tầng hương.',
      'Một phiên bản cao cấp của dòng trà bát bảo, khai thác chiều sâu thảo mộc và ngũ vị, gợi cảm giác ấm áp, tròn vị và tinh tế.',
      '["Kê huyết đằng", "kim ngân", "rễ cỏ tranh", "hồng trà", "nhân trần", "cam thảo", "sâm dương quy", "nam dương sâm"]'::jsonb,
      '["Vị trà đậm đà", "Biên độ hương phong phú", "Phù hợp quà biếu"]'::jsonb,
      'Hộp 30 túi lọc x 3g/túi',
      '/products/bat-bao-hoa-phuc.jpg',
      1402,
      1122,
      '/products/bat-bao-cuc-phuong-box.jpg',
      1563,
      1006,
      'Cúc Phương, Ninh Bình',
      4
    ),
    (
      'tra-thanh-nhiet-mat-gan',
      'Trà Thanh Nhiệt Mát Gan',
      'tra-thao-moc',
      'Một lựa chọn gọn gàng, sạch vị, hướng tới trải nghiệm uống thường nhật.',
      'Phối trộn thảo mộc theo tinh thần thanh lành, hỗ trợ cảm giác dễ chịu với cấu trúc hương rõ, mạch lạc và bền.',
      '["Bồ công anh", "cà gai leo", "kim ngân", "diệp hạ châu", "thảo quyết minh", "mã đề"]'::jsonb,
      '["Dễ uống", "Thích hợp dùng nóng", "Hương thơm tự nhiên"]'::jsonb,
      'Hộp 30 túi lọc x 3g/túi',
      '/products/thanh-nhiet-mat-gan-box.jpg',
      1563,
      1006,
      '/products/thanh-nhiet-mat-gan-box.jpg',
      1563,
      1006,
      'Việt Nam',
      5
    ),
    (
      'tra-gao-lut-la-sen-tui',
      'Trà Gạo Lứt Lá Sen Hòa Phúc - Túi',
      'duong-sinh',
      'Phiên bản đóng gói gọn nhẹ với vị ngũ cốc thanh và hậu vị sen dịu.',
      'Trà Gạo Lứt Lá Sen dạng túi phù hợp cho những ai muốn thưởng thức hương vị mộc lành trong một quy cách tiện mang theo.',
      '["Gạo lứt", "lá sen", "thảo quyết minh", "cỏ ngọt", "hoa hòe"]'::jsonb,
      '["Dễ mang theo", "Hậu vị dịu", "Phù hợp dùng hằng ngày"]'::jsonb,
      'Hộp trà túi lọc',
      '/products/tra-gao-lut-la-sen-tui.svg',
      1200,
      900,
      '/products/tra-gao-lut-la-sen-tui.svg',
      1200,
      900,
      'Việt Nam',
      6
    ),
    (
      'tra-duong-tam-an-nhien-tui',
      'Trà Dưỡng Tâm An Nhiên - Túi',
      'tra-thao-moc',
      'Quy cách gọn nhẹ, hương trà dịu và cân bằng cho những khoảng nghỉ mỗi ngày.',
      'Phiên bản túi của Trà Dưỡng Tâm An Nhiên mang đến trải nghiệm pha trà nhanh gọn, phù hợp mang theo hoặc làm quà tặng nhỏ.',
      '["Lạc tiên", "thảo quyết minh", "lá nếp", "cỏ ngọt", "vỏ long nhãn", "hoa cúc"]'::jsonb,
      '["Hương vị dễ uống", "Dễ mang theo", "Phù hợp dùng hằng ngày"]'::jsonb,
      'Hộp trà túi lọc',
      '/products/tra-duong-tam-an-nhien-tui.svg',
      1200,
      900,
      '/products/tra-duong-tam-an-nhien-tui.svg',
      1200,
      900,
      'Cúc Phương, Ninh Bình',
      7
    ),
    (
      'thao-duoc-ngam-chan',
      'Thảo dược ngâm chân',
      'duong-sinh',
      'Lựa chọn tiện lợi cho một khoảng thư giãn nhẹ nhàng tại nhà.',
      'Thảo dược ngâm chân Hòa Phúc được đóng gói gọn gàng, phù hợp sử dụng trong thói quen chăm sóc và thư giãn hằng ngày.',
      '["Thảo dược tự nhiên"]'::jsonb,
      '["Dễ sử dụng tại nhà", "Tiện lợi khi mang theo", "Phù hợp làm quà"]'::jsonb,
      'Hộp',
      '/products/thao-duoc-ngam-chan.svg',
      1200,
      900,
      '/products/thao-duoc-ngam-chan.svg',
      1200,
      900,
      'Việt Nam',
      8
    ),
    (
      'mat-ong-hoa-phuc',
      'Mật ong Hòa Phúc',
      'dac-san-vung-mien',
      'Mật ong Hòa Phúc với vị ngọt tự nhiên, phù hợp dùng hằng ngày hoặc làm quà.',
      'Mật ong Hòa Phúc là lựa chọn đặc sản gọn đẹp, phù hợp bổ sung vào gian bếp gia đình hoặc trao tặng người thân.',
      '["Mật ong"]'::jsonb,
      '["Vị ngọt tự nhiên", "Dễ dùng hằng ngày", "Phù hợp làm quà"]'::jsonb,
      'Chai',
      '/products/mat-ong-hoa-phuc.svg',
      1200,
      900,
      '/products/mat-ong-hoa-phuc.svg',
      1200,
      900,
      'Việt Nam',
      9
    )
)
insert into public.products (
  slug,
  category_id,
  name,
  short_description,
  long_description,
  ingredients,
  benefits,
  package_label,
  image,
  image_width,
  image_height,
  box_image,
  box_image_width,
  box_image_height,
  origin,
  sort_order
)
select
  seed.slug,
  category.id,
  seed.name,
  seed.short_description,
  seed.long_description,
  seed.ingredients,
  seed.benefits,
  seed.package_label,
  seed.image,
  seed.image_width,
  seed.image_height,
  seed.box_image,
  seed.box_image_width,
  seed.box_image_height,
  seed.origin,
  seed.sort_order
from product_seed as seed
join public.categories as category on category.slug = seed.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  ingredients = excluded.ingredients,
  benefits = excluded.benefits,
  package_label = excluded.package_label,
  image = excluded.image,
  image_width = excluded.image_width,
  image_height = excluded.image_height,
  box_image = excluded.box_image,
  box_image_width = excluded.box_image_width,
  box_image_height = excluded.box_image_height,
  origin = excluded.origin,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.product_prices (product_id, price_vnd, currency)
select product.id, price.price_vnd, 'VND'
from (
  values
    ('tra-thanh-nhiet-hoa-phuc', 130000::bigint),
    ('tra-duong-tam-an-nhien', 140000::bigint),
    ('tra-gao-lut-la-sen', 130000::bigint),
    ('tra-bat-bao-cuc-phuong', 140000::bigint),
    ('tra-thanh-nhiet-mat-gan', 130000::bigint),
    ('tra-gao-lut-la-sen-tui', 130000::bigint),
    ('tra-duong-tam-an-nhien-tui', 140000::bigint),
    ('thao-duoc-ngam-chan', 129000::bigint),
    ('mat-ong-hoa-phuc', 180000::bigint)
) as price (slug, price_vnd)
join public.products as product on product.slug = price.slug
on conflict (product_id) do update set
  price_vnd = excluded.price_vnd,
  currency = excluded.currency;

commit;
