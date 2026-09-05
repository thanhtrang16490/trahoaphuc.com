import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";
import { notifyTelegramOrder, notifyTelegramSystem } from "@/lib/telegram";
import { getZaloSession } from "@/lib/zalo-auth";

export function OPTIONS() {
  return apiOptions();
}

const ORDER_ERROR_MESSAGES: Record<string, string> = {
  ORDER_CUSTOMER_REQUIRED: "Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng.",
  ORDER_PHONE_INVALID: "Số điện thoại chưa đúng định dạng.",
  ORDER_PAYMENT_INVALID: "Vui lòng chọn phương thức thanh toán hợp lệ.",
  ORDER_CART_EMPTY: "Giỏ hàng đang trống.",
  ORDER_ITEM_INVALID: "Thông tin sản phẩm trong giỏ chưa hợp lệ.",
  ORDER_QUANTITY_INVALID: "Số lượng sản phẩm không hợp lệ.",
  ORDER_PRODUCT_NOT_FOUND: "Một sản phẩm trong giỏ không còn khả dụng.",
  ORDER_OUT_OF_STOCK: "Một sản phẩm trong giỏ đã hết hoặc không đủ tồn kho.",
  ORDER_PRICE_NOT_FOUND: "Một sản phẩm chưa có giá bán hợp lệ.",
  ORDER_COUPON_INVALID: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
  ORDER_COUPON_EXHAUSTED: "Mã giảm giá đã hết lượt sử dụng.",
  ORDER_COUPON_MINIMUM: "Giá trị đơn hàng chưa đạt điều kiện của mã giảm giá.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Dữ liệu đặt hàng không hợp lệ.", 400);
  }

  if (!isRecord(body) || !isRecord(body.customer) || !Array.isArray(body.items)) {
    return apiError("Thiếu thông tin đặt hàng.", 422);
  }

  const customer = body.customer;
  const recipient = readRecord(body.recipient);
  const items = body.items
    .map((item) => {
      if (!isRecord(item)) return null;
      const slug = readText(item.slug);
      const quantity = typeof item.quantity === "number" ? item.quantity : Number(item.quantity);
      return slug && Number.isInteger(quantity) && quantity > 0 && quantity <= 99 ? { slug, quantity } : null;
    })
    .filter((item): item is { slug: string; quantity: number } => item !== null);

  if (items.length === 0 || items.length !== body.items.length || items.length > 50) {
    return apiError("Thông tin sản phẩm trong giỏ chưa hợp lệ.", 422);
  }

  const customerName = readText(customer.name);
  const customerEmail = readText(customer.email).toLowerCase();
  const customerPhone = readText(customer.phone);
  const recipientName = readText(recipient.name) || readText(customer.name);
  const recipientEmail = readText(recipient.email) || customerEmail;
  const recipientPhone = readText(recipient.phone) || customerPhone;
  const province = readText(recipient.province) || readText(customer.province);
  const ward = readText(recipient.ward) || readText(customer.ward);
  const shippingAddress = [readText(recipient.address) || readText(customer.address), ward, province].filter(Boolean).join(", ");
  const shippingNote = readText(recipient.note) || readText(customer.note);
  const paymentMethod = readText(body.paymentMethod);
  const couponCode = readText(body.couponCode).toUpperCase() || null;
  const idempotencyKey = readText(body.idempotencyKey).slice(0, 120) || null;

  if (!customerName || !customerPhone || !shippingAddress) {
    return apiError(ORDER_ERROR_MESSAGES.ORDER_CUSTOMER_REQUIRED, 422);
  }
  if (!recipientName || !recipientPhone || !province || !ward || !(readText(recipient.address) || readText(customer.address))) {
    return apiError("Vui lòng điền đủ thông tin người nhận và địa chỉ giao hàng.", 422);
  }

  if (!/^(0|\+84)\d{8,10}$/.test(customerPhone.replace(/[.\s-]/g, ""))) {
    return apiError(ORDER_ERROR_MESSAGES.ORDER_PHONE_INVALID, 422);
  }

  if (!paymentMethod || !["cod", "bank_transfer"].includes(paymentMethod)) {
    return apiError(ORDER_ERROR_MESSAGES.ORDER_PAYMENT_INVALID, 422);
  }

  let customerId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    customerId = data.user?.id ?? null;
  } catch {
    // Guest checkout remains available when no Supabase Auth session exists.
  }
  if (!customerId) {
    const zaloSession = await getZaloSession(request);
    customerId = zaloSession?.id ?? null;
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.rpc("create_order", {
      p_customer_name: customerName,
      p_customer_email: customerEmail,
      p_customer_phone: customerPhone,
      p_shipping_address: shippingAddress,
      p_shipping_note: shippingNote,
      p_payment_method: paymentMethod,
      p_items: items,
      p_coupon_code: couponCode,
      p_idempotency_key: idempotencyKey,
      p_customer_id: customerId,
    });

    if (error) {
      const code = error.message.split(" ")[0];
      if (ORDER_ERROR_MESSAGES[code]) {
        return apiError(ORDER_ERROR_MESSAGES[code], 422);
      }
      return apiError("Hệ thống đặt hàng chưa sẵn sàng. Vui lòng thử lại sau ít phút.", 503);
    }

    void notifyTelegramOrder({
      order: (data ?? {}) as Record<string, unknown>,
      customer: { name: customerName, email: customerEmail, phone: customerPhone, address: shippingAddress, note: shippingNote },
      recipient: { name: recipientName, email: recipientEmail, phone: recipientPhone },
      items,
      isGuest: !customerId,
    });

    const { error: recipientError } = await supabaseAdmin.from("orders").update({ recipient_name: recipientName, recipient_email: recipientEmail, recipient_phone: recipientPhone }).eq("id", data.id);
    if (recipientError) return apiError("Đơn đã tạo nhưng chưa lưu đủ thông tin người nhận.", 503);
    return apiResponse({ ...data, recipient_name: recipientName, recipient_phone: recipientPhone }, { status: 201 });
  } catch {
    void notifyTelegramSystem({ title: "Không thể tạo đơn hàng", detail: "RPC create_order không phản hồi hoặc thiếu cấu hình server." });
    return apiError("Hệ thống đặt hàng chưa sẵn sàng. Vui lòng thử lại sau ít phút.", 503);
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const customerId = authData.user?.id ?? (await getZaloSession(request))?.id;
    if (authError && !customerId) {
      return apiError("Vui lòng đăng nhập để xem lịch sử đơn hàng.", 401);
    }
    if (!customerId) return apiError("Vui lòng đăng nhập để xem lịch sử đơn hàng.", 401);

    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, payment_status, payment_method, subtotal_vnd, shipping_fee_vnd, discount_vnd, total_vnd, currency, created_at, order_items(product_name, quantity, unit_price_vnd, line_total_vnd)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return apiError("Chưa thể tải lịch sử đơn hàng.", 503);
    return apiResponse(data ?? []);
  } catch {
    return apiError("Hệ thống lịch sử đơn hàng chưa sẵn sàng.", 503);
  }
}
