import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiResponse } from "@/lib/api-v1";
import { notifyTelegramSystem } from "@/lib/telegram";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) return apiError("Vui lòng đăng nhập để quản lý đơn hàng.", 401);

  const { id } = await params;
  if (!id) return apiError("Mã đơn hàng không hợp lệ.", 422);

  try {
    const admin = createAdminClient();
    const { data: order, error } = await admin.rpc("cancel_order", { p_order_id: id, p_customer_id: data.user.id });
    if (error) {
      const code = error.message.split(" ")[0];
      const messages: Record<string, string> = {
        ORDER_NOT_FOUND: "Không tìm thấy đơn hàng.",
        ORDER_FORBIDDEN: "Bạn không có quyền thao tác đơn hàng này.",
        ORDER_CANNOT_CANCEL: "Đơn hàng đã được xử lý nên không thể hủy trực tuyến.",
      };
      return apiError(messages[code] || "Không thể hủy đơn hàng.", code === "ORDER_FORBIDDEN" ? 403 : 422);
    }
    await admin.from("orders").update({ dealer_commission_status: "cancelled" }).eq("id", id).eq("customer_id", data.user.id).not("dealer_id", "is", null);
    return apiResponse(order);
  } catch {
    void notifyTelegramSystem({ title: "Không thể hủy đơn hàng", detail: `Order ID: ${id}` });
    return apiError("Hệ thống hủy đơn chưa sẵn sàng.", 503);
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return apiError("Vui lòng đăng nhập để xem đơn hàng.", 401);
  const { id } = await params;
  if (!id) return apiError("Mã đơn hàng không hợp lệ.", 422);

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select("id, order_number, status, payment_status, payment_method, customer_name, customer_email, customer_phone, recipient_name, recipient_email, recipient_phone, shipping_address, shipping_note, subtotal_vnd, shipping_fee_vnd, discount_vnd, total_vnd, coupon_code, shipping_provider, tracking_code, paid_at, shipped_at, delivered_at, cancelled_at, created_at, updated_at, order_items(id, product_name, product_slug, unit_price_vnd, quantity, line_total_vnd), order_status_history(id, from_status, to_status, note, created_at)")
      .eq("id", id)
      .eq("customer_id", authData.user.id)
      .single();
    if (error || !data) return apiError("Không tìm thấy đơn hàng.", 404);
    return apiResponse(data);
  } catch {
    return apiError("Chưa thể tải chi tiết đơn hàng.", 503);
  }
}
