import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context || !["admin", "staff"].includes(context.role)) return apiError("Bạn không có quyền cập nhật coupon.", 403);
  const body = await request.json().catch(() => ({}));
  const { id } = await params;
  const { data, error } = await context.admin.from("coupons").update({ is_active: body.is_active === true }).eq("id", id).select("id, code, is_active").single();
  if (error) return apiError("Không thể cập nhật coupon.", 503);
  return apiResponse(data);
}

export async function DELETE(request: Request, contextInput: { params: Promise<{ id: string }> }) {
  return PATCH(new Request(request.url, { method: "PATCH", body: JSON.stringify({ is_active: false }), headers: { "content-type": "application/json" } }), contextInput);
}
