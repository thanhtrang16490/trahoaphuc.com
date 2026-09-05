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
