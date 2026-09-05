import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

function value(body: Record<string, unknown>, key: string) { return typeof body[key] === "string" ? body[key].trim() : ""; }

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền tạo sản phẩm.", 403);
  const body = await request.json().catch(() => ({}));
  const product = { slug: value(body, "slug").toLowerCase(), name: value(body, "name"), category_id: value(body, "category_id"), short_description: value(body, "short_description"), long_description: value(body, "long_description"), package_label: value(body, "package_label"), image: value(body, "image"), box_image: value(body, "box_image"), origin: value(body, "origin"), stock_quantity: Number(body.stock_quantity) };
  const price = Number(body.price_vnd);
  const originalPrice = body.original_price_vnd === undefined || body.original_price_vnd === "" ? price : Number(body.original_price_vnd);
  if (!product.slug || !product.name || !product.category_id || !Number.isInteger(product.stock_quantity) || product.stock_quantity < 0 || !Number.isInteger(price) || price <= 0 || !Number.isInteger(originalPrice) || originalPrice < price) return apiError("Thiếu hoặc sai thông tin sản phẩm. Giá gốc phải lớn hơn hoặc bằng giá bán.", 422);
  const { data, error } = await context.admin.from("products").insert(product).select("id, slug, name").single();
  if (error || !data) return apiError("Không thể tạo sản phẩm.", 503);
  const { error: priceError } = await context.admin.from("product_prices").insert({ product_id: data.id, price_vnd: price, original_price_vnd: originalPrice, currency: "VND" });
  if (priceError) { await context.admin.from("products").delete().eq("id", data.id); return apiError("Không thể tạo giá sản phẩm.", 503); }
  return apiResponse(data, { status: 201 });
}
