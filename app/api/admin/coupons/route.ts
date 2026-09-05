import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context || !["admin", "staff"].includes(context.role)) return apiError("Bạn không có quyền tạo coupon.", 403);
  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  const label = typeof body.label === "string" ? body.label.trim() : "";
  const discountType = body.discount_type;
  const value = Number(body.discount_value);
  if (!code || !label || !["percent", "fixed", "shipping"].includes(discountType) || !Number.isFinite(value) || value <= 0) return apiError("Thông tin coupon không hợp lệ.", 422);
  const { data, error } = await context.admin.from("coupons").insert({ code, label, discount_type: discountType, discount_value: value, min_subtotal_vnd: Number(body.min_subtotal_vnd) || 0, note: typeof body.note === "string" ? body.note.trim() : "", source: "Admin" }).select("id, code, label").single();
  if (error) return apiError("Không thể tạo coupon.", 503);
  return apiResponse(data, { status: 201 });
}
