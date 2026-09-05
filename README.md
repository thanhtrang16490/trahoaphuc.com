# trahoaphuc.com

Website Nông Sản Hòa Phúc.

## Supabase catalog

Catalog runtime đọc từ Supabase qua `lib/catalog.ts`. Migration tạo và seed các bảng `categories`, `products` và `product_prices`:

```bash
supabase login
supabase link --project-ref ahvyaemvorqoywpjhmnb
supabase db push
```

Các trang server và API dùng Supabase làm nguồn chính. Dữ liệu trong `data/` chỉ là fallback để website vẫn hiển thị trong lúc migration chưa được apply hoặc Supabase tạm thời không khả dụng.

Website thương mại điện tử cho thương hiệu trà Hòa Phúc.

## Telegram notifications

Notification service nằm ở `lib/telegram.ts` và chỉ chạy phía server. Bot đang nhận các event:

- Đơn hàng mới, gồm cả khách guest.
- Tài khoản mới khi Supabase Auth trả về session.
- Lead đăng ký đại lý.
- Cảnh báo lỗi tạo đơn hoặc lưu lead.

Thiết lập trong `.env.local`:

```bash
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

Không đưa bot token vào biến `NEXT_PUBLIC_*` hoặc commit `.env.local`. Chat ID hiện tại là `1469558259`; nếu chuyển sang nhóm Telegram, thêm bot vào nhóm và thay bằng chat ID của nhóm.

## Admin

Tài khoản được lưu trong Supabase Auth, hồ sơ ở `profiles` và quyền ở `user_roles`. Các role gồm `customer`, `dealer`, `staff`, `editor` và `admin`. Tạo hoặc nâng cấp tài khoản admin bằng credential chỉ có trong shell:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='your-long-password' ADMIN_USERNAME=admin yarn admin:create
```

Sau đó đăng nhập tại `/dang-nhap` và mở `/quan-tri`.
