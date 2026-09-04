# Hòa Phúc API v1

Base URL: `https://trahoaphuc.com/api/v1`

## Endpoints

### Health

`GET /health`

### Danh mục

`GET /categories`

### Danh sách sản phẩm

`GET /products`

Query hỗ trợ:

- `q`: tìm theo tên, danh mục hoặc mô tả.
- `category`: lọc theo tên danh mục.
- `limit`: giới hạn từ 1 đến 50, mặc định 50.

### Chi tiết sản phẩm

`GET /products/{slug}`

Response thành công có dạng:

```json
{
  "ok": true,
  "data": {}
}
```

API là dữ liệu public chỉ đọc, có CORS cho Mini App và cache ngắn hạn. URL ảnh trả về là URL tuyệt đối. Đặt `NEXT_PUBLIC_SITE_URL` khi domain production khác `trahoaphuc.com`.
