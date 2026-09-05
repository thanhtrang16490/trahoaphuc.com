import "server-only";

type TelegramResult = { ok: boolean };

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isTelegramConfigured() {
  return process.env.TELEGRAM_ENABLED !== "false" && Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

export async function sendTelegramMessage(message: string) {
  if (!isTelegramConfigured()) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const result = (await response.json()) as TelegramResult;
    return response.ok && result.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export function telegramText(value: unknown) {
  return escapeHtml(value);
}

export async function notifyTelegramOrder(input: {
  order: Record<string, unknown>;
  customer: { name: string; email: string; phone: string; address: string; note: string };
  recipient?: { name: string; email: string; phone: string };
  items: Array<{ slug: string; quantity: number }>;
  isGuest: boolean;
}) {
  const itemLines = input.items.map((item) => `• ${telegramText(item.slug)} x${item.quantity}`).join("\n");
  return sendTelegramMessage([
    input.isGuest ? "<b>🛒 ĐƠN HÀNG MỚI / KHÁCH HÀNG MỚI</b>" : "<b>🛒 ĐƠN HÀNG MỚI</b>",
    `Mã đơn: <b>${telegramText(input.order.order_number)}</b>`,
    `Khách: ${telegramText(input.customer.name)}${input.isGuest ? " (guest)" : ""}`,
    `Điện thoại: ${telegramText(input.customer.phone)}`,
    `Email: ${telegramText(input.customer.email || "-")}`,
    input.recipient ? `Người nhận: ${telegramText(input.recipient.name)} · ${telegramText(input.recipient.phone)}${input.recipient.email ? ` · ${telegramText(input.recipient.email)}` : ""}` : "",
    `Địa chỉ: ${telegramText(input.customer.address)}`,
    `Sản phẩm:\n${itemLines}`,
    `Tạm tính: ${telegramText(input.order.subtotal_vnd)} ${telegramText(input.order.currency || "VND")}`,
    `Giảm giá: ${telegramText(input.order.discount_vnd)} ${telegramText(input.order.currency || "VND")}`,
    `Tổng tiền: <b>${telegramText(input.order.total_vnd)} ${telegramText(input.order.currency || "VND")}</b>`,
    `Thanh toán: ${telegramText(input.order.payment_method)}`,
    input.customer.note ? `Ghi chú: ${telegramText(input.customer.note)}` : "",
  ].filter(Boolean).join("\n"));
}

export function notifyTelegramOrderStatus(input: {
  order: { order_number: string; customer_name: string; customer_phone: string; total_vnd: number | string; status: string; payment_status: string };
  previous: { status: string; payment_status: string };
}) {
  const changed = input.previous.status !== input.order.status || input.previous.payment_status !== input.order.payment_status;
  if (!changed) return Promise.resolve(false);
  return sendTelegramMessage([
    "<b>🔄 CẬP NHẬT ĐƠN HÀNG</b>",
    `Mã đơn: <b>${telegramText(input.order.order_number)}</b>`,
    `Khách: ${telegramText(input.order.customer_name)}`,
    `Điện thoại: ${telegramText(input.order.customer_phone)}`,
    `Tổng tiền: <b>${telegramText(input.order.total_vnd)} VND</b>`,
    `Trạng thái đơn: ${telegramText(input.previous.status)} → <b>${telegramText(input.order.status)}</b>`,
    `Thanh toán: ${telegramText(input.previous.payment_status)} → <b>${telegramText(input.order.payment_status)}</b>`,
  ].join("\n"));
}

export function notifyTelegramAccount(input: { id: string; name: string; email: string; phone: string }) {
  return sendTelegramMessage([
    "<b>👤 TÀI KHOẢN MỚI</b>",
    `Tên: ${telegramText(input.name || "-")}`,
    `Email: ${telegramText(input.email)}`,
    `Điện thoại: ${telegramText(input.phone || "-")}`,
    `User ID: <code>${telegramText(input.id)}</code>`,
  ].join("\n"));
}

export function notifyTelegramLogin(input: { id: string; name: string; email: string; username: string; userAgent: string; ip: string }) {
  return sendTelegramMessage([
    "<b>🔐 TÀI KHOẢN ĐĂNG NHẬP</b>",
    `Tài khoản: ${telegramText(input.name || input.username || "-")}`,
    `Email: ${telegramText(input.email)}`,
    `Username: ${telegramText(input.username || "-")}`,
    `Thời gian: ${telegramText(new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }))}`,
    `IP: ${telegramText(input.ip || "-")}`,
    `Thiết bị: ${telegramText(input.userAgent || "-").slice(0, 300)}`,
    `User ID: <code>${telegramText(input.id)}</code>`,
  ].join("\n"));
}

export function notifyTelegramLead(input: {
  name: string;
  phone: string;
  area: string;
  businessType: string;
  scale: string;
  productInterest: string;
  salesChannel: string;
  message: string;
}) {
  return sendTelegramMessage([
    "<b>📥 LEAD MỚI / ĐĂNG KÝ ĐẠI LÝ</b>",
    `Tên / doanh nghiệp: ${telegramText(input.name)}`,
    `Điện thoại: ${telegramText(input.phone)}`,
    `Khu vực: ${telegramText(input.area)}`,
    `Loại hình: ${telegramText(input.businessType)}`,
    `Quy mô: ${telegramText(input.scale)}`,
    `Sản phẩm: ${telegramText(input.productInterest)}`,
    `Kênh bán: ${telegramText(input.salesChannel)}`,
    input.message ? `Nhu cầu: ${telegramText(input.message)}` : "",
  ].filter(Boolean).join("\n"));
}

export function notifyTelegramSystem(input: { title: string; detail: string }) {
  return sendTelegramMessage([
    "<b>⚠️ CẢNH BÁO HỆ THỐNG</b>",
    `Sự kiện: ${telegramText(input.title)}`,
    `Chi tiết: ${telegramText(input.detail)}`,
  ].join("\n"));
}
