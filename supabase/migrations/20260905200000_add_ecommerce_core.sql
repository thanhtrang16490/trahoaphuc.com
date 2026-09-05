begin;

alter table public.products
  add column if not exists stock_quantity integer not null default 999;

alter table public.products
  drop constraint if exists products_stock_quantity_check;

alter table public.products
  add constraint products_stock_quantity_check check (stock_quantity >= 0);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code)),
  label text not null,
  discount_type text not null check (discount_type in ('percent', 'fixed', 'shipping')),
  discount_value numeric(12, 2) not null check (discount_value > 0),
  min_subtotal_vnd bigint not null default 0 check (min_subtotal_vnd >= 0),
  max_discount_vnd bigint check (max_discount_vnd is null or max_discount_vnd > 0),
  note text not null default '',
  source text not null default 'Ưu đãi Hòa Phúc',
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at is null or starts_at is null or ends_at > starts_at),
  check (usage_limit is null or usage_count <= usage_limit)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  idempotency_key text unique,
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null,
  shipping_address text not null,
  shipping_note text not null default '',
  payment_method text not null check (payment_method in ('cod', 'bank_transfer')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'packing', 'shipping', 'delivered', 'cancelled')),
  coupon_code text,
  subtotal_vnd bigint not null check (subtotal_vnd >= 0),
  shipping_fee_vnd bigint not null default 0 check (shipping_fee_vnd >= 0),
  discount_vnd bigint not null default 0 check (discount_vnd >= 0),
  total_vnd bigint not null check (total_vnd >= 0),
  currency text not null default 'VND' check (currency = 'VND'),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on update cascade on delete cascade,
  product_id uuid not null references public.products(id) on update cascade on delete restrict,
  product_slug text not null,
  product_name text not null,
  unit_price_vnd bigint not null check (unit_price_vnd > 0),
  quantity integer not null check (quantity > 0),
  line_total_vnd bigint not null check (line_total_vnd > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists coupons_public_lookup_idx
  on public.coupons (is_active, starts_at, ends_at, code);

create index if not exists orders_customer_created_idx
  on public.orders (customer_id, created_at desc);

create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read active coupons" on public.coupons;
create policy "Public can read active coupons"
on public.coupons
for select
to anon, authenticated
using (
  is_active
  and (starts_at is null or starts_at <= timezone('utc', now()))
  and (ends_at is null or ends_at > timezone('utc', now()))
  and (usage_limit is null or usage_count < usage_limit)
);

drop policy if exists "Users can read their own orders" on public.orders;
create policy "Users can read their own orders"
on public.orders
for select
to authenticated
using (customer_id = auth.uid());

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
      and orders.customer_id = auth.uid()
  )
);

grant select on public.coupons to anon, authenticated;
grant select on public.orders, public.order_items to authenticated;

insert into public.coupons (
  code,
  label,
  discount_type,
  discount_value,
  min_subtotal_vnd,
  note,
  source
)
values
  ('HOAPHUC5', 'Giảm 5%', 'percent', 5, 0, 'Áp dụng cho mọi đơn hàng', 'Mã dành cho khách mới'),
  ('FREESHIP200', 'Miễn phí ship', 'shipping', 30000, 200000, 'Đơn từ 200.000đ', 'Mã vận chuyển của Hòa Phúc'),
  ('HOAPHUC10', 'Giảm 10%', 'percent', 10, 1000000, 'Đơn từ 1.000.000đ', 'Mã thành viên thân thiết'),
  ('HOAPHUC15', 'Giảm 15%', 'percent', 15, 1500000, 'Ưu đãi thành viên, đơn từ 1.500.000đ', 'Mã thành viên thân thiết'),
  ('HOAPHUC100', 'Giảm 100.000đ', 'fixed', 100000, 500000, 'Đơn từ 500.000đ', 'Voucher quà tặng từ vòng quay'),
  ('HOAPHUCBI', 'Giảm 50.000đ', 'fixed', 50000, 300000, 'Đơn từ 300.000đ', 'Mã bí mật từ vòng quay')
on conflict (code) do update set
  label = excluded.label,
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_subtotal_vnd = excluded.min_subtotal_vnd,
  note = excluded.note,
  source = excluded.source,
  is_active = true;

create or replace function public.create_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address text,
  p_shipping_note text,
  p_payment_method text,
  p_items jsonb,
  p_coupon_code text default null,
  p_idempotency_key text default null,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_line_items jsonb := '[]'::jsonb;
  v_product_id uuid;
  v_product_name text;
  v_product_slug text;
  v_unit_price bigint;
  v_stock_quantity integer;
  v_quantity integer;
  v_line_total bigint;
  v_subtotal bigint := 0;
  v_shipping_fee bigint := 0;
  v_product_discount bigint := 0;
  v_shipping_discount bigint := 0;
  v_discount bigint := 0;
  v_total bigint := 0;
  v_coupon_code text := nullif(upper(trim(coalesce(p_coupon_code, ''))), '');
  v_discount_type text;
  v_discount_value numeric(12, 2);
  v_min_subtotal bigint;
  v_max_discount bigint;
  v_usage_limit integer;
  v_usage_count integer;
  v_order_id uuid;
  v_order_number text;
  v_existing_order jsonb;
begin
  if nullif(trim(coalesce(p_customer_name, '')), '') is null
    or nullif(trim(coalesce(p_customer_phone, '')), '') is null
    or nullif(trim(coalesce(p_shipping_address, '')), '') is null then
    raise exception 'ORDER_CUSTOMER_REQUIRED';
  end if;

  if p_customer_phone !~ '^(0|\+84)[0-9 .-]{8,12}$' then
    raise exception 'ORDER_PHONE_INVALID';
  end if;

  if p_payment_method not in ('cod', 'bank_transfer') then
    raise exception 'ORDER_PAYMENT_INVALID';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'ORDER_CART_EMPTY';
  end if;

  if nullif(trim(coalesce(p_idempotency_key, '')), '') is not null then
    select jsonb_build_object(
      'id', id,
      'order_number', order_number,
      'status', status,
      'payment_status', payment_status,
      'payment_method', payment_method,
      'subtotal_vnd', subtotal_vnd,
      'shipping_fee_vnd', shipping_fee_vnd,
      'discount_vnd', discount_vnd,
      'total_vnd', total_vnd,
      'currency', currency
    )
    into v_existing_order
    from public.orders
    where idempotency_key = trim(p_idempotency_key);

    if v_existing_order is not null then
      return v_existing_order;
    end if;
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_slug := nullif(trim(v_item ->> 'slug'), '');
    if v_product_slug is null or coalesce(v_item ->> 'quantity', '') !~ '^[0-9]+$' then
      raise exception 'ORDER_ITEM_INVALID';
    end if;

    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'ORDER_QUANTITY_INVALID';
    end if;

    select id, name, stock_quantity
    into v_product_id, v_product_name, v_stock_quantity
    from public.products
    where slug = v_product_slug
      and is_active
    for update;

    if not found then
      raise exception 'ORDER_PRODUCT_NOT_FOUND';
    end if;

    if v_stock_quantity < v_quantity then
      raise exception 'ORDER_OUT_OF_STOCK';
    end if;

    select price_vnd
    into v_unit_price
    from public.product_prices
    where product_id = v_product_id;

    if not found then
      raise exception 'ORDER_PRICE_NOT_FOUND';
    end if;

    v_line_total := v_unit_price * v_quantity;
    v_subtotal := v_subtotal + v_line_total;
    v_line_items := v_line_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product_id,
      'product_slug', v_product_slug,
      'product_name', v_product_name,
      'unit_price_vnd', v_unit_price,
      'quantity', v_quantity,
      'line_total_vnd', v_line_total
    ));

    update public.products
    set stock_quantity = stock_quantity - v_quantity
    where id = v_product_id;
  end loop;

  if v_subtotal > 0 then
    v_shipping_fee := 30000;
  end if;

  if v_coupon_code is not null then
    select discount_type, discount_value, min_subtotal_vnd, max_discount_vnd, usage_limit, usage_count
    into v_discount_type, v_discount_value, v_min_subtotal, v_max_discount, v_usage_limit, v_usage_count
    from public.coupons
    where code = v_coupon_code
      and is_active
      and (starts_at is null or starts_at <= timezone('utc', now()))
      and (ends_at is null or ends_at > timezone('utc', now()))
    for update;

    if not found then
      raise exception 'ORDER_COUPON_INVALID';
    end if;

    if v_usage_limit is not null and v_usage_count >= v_usage_limit then
      raise exception 'ORDER_COUPON_EXHAUSTED';
    end if;

    if v_subtotal < v_min_subtotal then
      raise exception 'ORDER_COUPON_MINIMUM';
    end if;

    if v_discount_type = 'percent' then
      v_product_discount := round(v_subtotal * v_discount_value / 100)::bigint;
      if v_max_discount is not null then
        v_product_discount := least(v_product_discount, v_max_discount);
      end if;
    elsif v_discount_type = 'fixed' then
      v_product_discount := least(v_subtotal, v_discount_value::bigint);
    elsif v_discount_type = 'shipping' then
      v_shipping_discount := least(v_shipping_fee, v_discount_value::bigint);
    end if;
  end if;

  v_discount := v_product_discount + v_shipping_discount;
  v_total := greatest(0, v_subtotal + v_shipping_fee - v_discount);
  v_order_number := 'HP-' || to_char(clock_timestamp(), 'YYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4));

  insert into public.orders (
    order_number,
    idempotency_key,
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_note,
    payment_method,
    coupon_code,
    subtotal_vnd,
    shipping_fee_vnd,
    discount_vnd,
    total_vnd
  )
  values (
    v_order_number,
    nullif(trim(coalesce(p_idempotency_key, '')), ''),
    p_customer_id,
    trim(p_customer_name),
    lower(trim(coalesce(p_customer_email, ''))),
    trim(p_customer_phone),
    trim(p_shipping_address),
    trim(coalesce(p_shipping_note, '')),
    p_payment_method,
    v_coupon_code,
    v_subtotal,
    v_shipping_fee,
    v_discount,
    v_total
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_slug,
    product_name,
    unit_price_vnd,
    quantity,
    line_total_vnd
  )
  select
    v_order_id,
    item.product_id,
    item.product_slug,
    item.product_name,
    item.unit_price_vnd,
    item.quantity,
    item.line_total_vnd
  from jsonb_to_recordset(v_line_items) as item(
    product_id uuid,
    product_slug text,
    product_name text,
    unit_price_vnd bigint,
    quantity integer,
    line_total_vnd bigint
  );

  if v_coupon_code is not null then
    update public.coupons
    set usage_count = usage_count + 1
    where code = v_coupon_code;
  end if;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'status', 'pending',
    'payment_status', 'pending',
    'payment_method', p_payment_method,
    'subtotal_vnd', v_subtotal,
    'shipping_fee_vnd', v_shipping_fee,
    'discount_vnd', v_discount,
    'total_vnd', v_total,
    'currency', 'VND'
  );
end;
$$;

revoke all on function public.create_order(text, text, text, text, text, text, jsonb, text, text, uuid) from public, anon, authenticated;
grant execute on function public.create_order(text, text, text, text, text, text, jsonb, text, text, uuid) to service_role;

commit;
