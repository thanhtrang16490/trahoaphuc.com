import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";
import { notifyTelegramOrder } from "@/lib/telegram";

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return apiError("Bạn không có quyền truy cập khu vực quản trị.", 403);
  const body = await request.json().catch(() => ({}));
  const customer = body.customer ?? {};
  const recipient = body.recipient ?? customer;
  const items = Array.isArray(body.items) ? body.items : [];
  const normalizedItems = items.map((item: { slug?: unknown; quantity?: unknown }) => ({ slug: text(item.slug), quantity: Number(item.quantity) })).filter((item: { slug: string; quantity: number }) => item.slug && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99);
  const customerName = text(customer.name);
  const customerEmail = text(customer.email).toLowerCase();
  const customerPhone = text(customer.phone);
  const recipientName = text(recipient.name) || customerName;
  const recipientPhone = text(recipient.phone) || customerPhone;
  const province = text(recipient.province);
  const ward = text(recipient.ward);
  const address = [text(recipient.address), ward, province].filter(Boolean).join(", ");
  const paymentMethod = text(body.paymentMethod);
  if (!customerName || !customerPhone || !address) return apiError("Vui lòng nhập đủ thông tin khách hàng và địa chỉ.", 422);
  if (!recipientName || !recipientPhone || !province || !ward || !text(recipient.address)) return apiError("Vui lòng nhập đủ thông tin người nhận và địa chỉ giao hàng.", 422);
  if (!/^(0|\+84)\d{8,10}$/.test(customerPhone.replace(/[.\s-]/g, "")) || !/^(0|\+84)\d{8,10}$/.test(recipientPhone.replace(/[.\s-]/g, ""))) return apiError("Số điện thoại chưa đúng định dạng.", 422);
  if (!normalizedItems.length || normalizedItems.length !== items.length) return apiError("Đơn hàng cần có sản phẩm và số lượng hợp lệ.", 422);
  if (!['cod', 'bank_transfer'].includes(paymentMethod)) return apiError("Phương thức thanh toán không hợp lệ.", 422);
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("create_order", {
      p_customer_name: customerName,
      p_customer_email: customerEmail,
      p_customer_phone: customerPhone,
      p_shipping_address: address,
      p_shipping_note: text(recipient.note) || text(customer.note),
      p_payment_method: paymentMethod,
      p_items: normalizedItems,
      p_coupon_code: text(body.couponCode).toUpperCase() || null,
      p_idempotency_key: `admin-${crypto.randomUUID()}`,
      p_customer_id: text(body.customerId) || null,
    });
    if (error) return apiError("Không thể tạo đơn hàng. Vui lòng kiểm tra sản phẩm và tồn kho.", 422);
    const { error: recipientError } = await admin.from("orders").update({ recipient_name: recipientName, recipient_email: text(recipient.email) || customerEmail, recipient_phone: recipientPhone }).eq("id", data.id);
    if (recipientError) return apiError("Đơn đã tạo nhưng chưa lưu đủ thông tin người nhận.", 503);
    void notifyTelegramOrder({ order: (data ?? {}) as Record<string, unknown>, customer: { name: customerName, email: customerEmail, phone: customerPhone, address, note: text(recipient.note) || text(customer.note) }, recipient: { name: recipientName, email: text(recipient.email) || customerEmail, phone: recipientPhone }, items: normalizedItems, isGuest: !text(body.customerId) });
    return apiResponse(data, { status: 201 });
  } catch {
    return apiError("Hệ thống tạo đơn hàng chưa sẵn sàng.", 503);
  }
}
