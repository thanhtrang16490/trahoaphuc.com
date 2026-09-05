import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

export async function GET() {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể quản lý đại lý.", 403);
  const { data, error } = await context.admin
    .from("dealer_profiles")
    .select("user_id, business_name, area, business_type, discount_rate, commission_rate, status, note, created_at, profiles(full_name, email, phone)")
    .order("created_at", { ascending: false });
  const [products, prices] = await Promise.all([
    context.admin.from("products").select("id, name, slug").eq("is_active", true).order("sort_order"),
    context.admin.from("dealer_product_prices").select("id, dealer_id, product_id, price_vnd, min_quantity, is_active").order("min_quantity"),
  ]);
  if (error || products.error || prices.error) return apiError("Chưa thể tải dữ liệu đại lý.", 503);
  return apiResponse({ dealers: data ?? [], products: products.data ?? [], prices: prices.data ?? [] });
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể cập nhật chính sách đại lý.", 403);
  const body = await request.json().catch(() => ({}));
  const userId = typeof body.user_id === "string" ? body.user_id : "";
  const productId = typeof body.product_id === "string" ? body.product_id : "";
  if (productId) {
    const price = Number(body.price_vnd);
    const minQuantity = Number(body.min_quantity);
    if (!Number.isInteger(price) || price <= 0 || !Number.isInteger(minQuantity) || minQuantity <= 0) return apiError("Giá đại lý hoặc số lượng tối thiểu không hợp lệ.", 422);
    const { data, error } = await context.admin.from("dealer_product_prices").upsert({ dealer_id: userId, product_id: productId, price_vnd: price, min_quantity: minQuantity, is_active: body.is_active !== false }, { onConflict: "dealer_id,product_id,min_quantity" }).select("id, dealer_id, product_id, price_vnd, min_quantity, is_active").single();
    if (error) return apiError("Không thể lưu bảng giá đại lý.", 503);
    return apiResponse(data);
  }
  const commissionRate = Number(body.commission_rate);
  const status = typeof body.status === "string" ? body.status : "";
  if (!userId || !Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 100) return apiError("Tỷ lệ hoa hồng không hợp lệ.", 422);
  if (!["pending", "active", "paused", "rejected"].includes(status)) return apiError("Trạng thái đại lý không hợp lệ.", 422);
  const { data, error } = await context.admin.from("dealer_profiles").update({ commission_rate: commissionRate, status }).eq("user_id", userId).select("user_id, commission_rate, status").single();
  if (error) return apiError("Không thể cập nhật chính sách đại lý.", 503);
  return apiResponse(data);
}
