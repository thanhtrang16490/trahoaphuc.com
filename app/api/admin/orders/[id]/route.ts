import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";
import { notifyTelegramOrderStatus } from "@/lib/telegram";

const statuses = ["pending", "confirmed", "packing", "shipping", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "refunded"];
const commissionStatuses = ["pending", "approved", "paid", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context) return apiError("Bạn không có quyền truy cập khu vực quản trị.", 403);
  const body = await request.json().catch(() => ({}));
  if (body.status !== undefined && !statuses.includes(body.status)) return apiError("Trạng thái đơn hàng không hợp lệ.", 422);
  if (body.payment_status !== undefined && !paymentStatuses.includes(body.payment_status)) return apiError("Trạng thái thanh toán không hợp lệ.", 422);
  if (body.dealer_commission_status !== undefined && !commissionStatuses.includes(body.dealer_commission_status)) return apiError("Trạng thái hoa hồng không hợp lệ.", 422);
  if (body.shipping_provider !== undefined && typeof body.shipping_provider !== "string") return apiError("Nhà vận chuyển không hợp lệ.", 422);
  if (body.tracking_code !== undefined && typeof body.tracking_code !== "string") return apiError("Mã vận đơn không hợp lệ.", 422);
  if (body.status === undefined && body.payment_status === undefined && body.dealer_commission_status === undefined && body.shipping_provider === undefined && body.tracking_code === undefined) return apiError("Chưa có thông tin cần cập nhật.", 422);
  const { id } = await params;
  const changes = {
    ...(body.status !== undefined && body.status !== "cancelled" ? { status: body.status } : {}),
    ...(body.payment_status !== undefined ? { payment_status: body.payment_status } : {}),
    ...(body.dealer_commission_status !== undefined ? { dealer_commission_status: body.dealer_commission_status } : {}),
    ...(body.shipping_provider !== undefined ? { shipping_provider: body.shipping_provider.trim().slice(0, 80) } : {}),
    ...(body.tracking_code !== undefined ? { tracking_code: body.tracking_code.trim().slice(0, 120) } : {}),
  };
  const { data: previous, error: previousError } = await context.admin.from("orders").select("order_number, customer_name, customer_phone, total_vnd, status, payment_status").eq("id", id).single();
  if (previousError || !previous) return apiError("Không tìm thấy đơn hàng.", 404);
  if (body.status === "cancelled" && previous.status !== "cancelled") {
    const { data: cancelled, error: cancelError } = await context.admin.rpc("cancel_order", { p_order_id: id, p_customer_id: null });
    if (cancelError) return apiError("Không thể hủy đơn hàng. Đơn có thể đã được xử lý hoặc thanh toán.", 422);
    await context.admin.from("orders").update({ dealer_commission_status: "cancelled" }).eq("id", id).not("dealer_id", "is", null);
    const telegramSent = await notifyTelegramOrderStatus({ order: { ...previous, status: "cancelled", payment_status: previous.payment_status }, previous });
    return apiResponse({ ...cancelled, telegram_sent: telegramSent });
  }
  const { data, error } = await context.admin.from("orders").update(changes).eq("id", id).select("id, order_number, status, payment_status").single();
  if (error) {
    if (error.message.startsWith("ORDER_STATUS_TRANSITION_INVALID")) return apiError("Trạng thái đơn hàng không thể chuyển theo quy trình hiện tại.", 422);
    return apiError("Không thể cập nhật đơn hàng.", 503);
  }
  const telegramSent = await notifyTelegramOrderStatus({ order: { ...previous, status: data.status, payment_status: data.payment_status }, previous });
  return apiResponse({ ...data, telegram_sent: telegramSent });
}
