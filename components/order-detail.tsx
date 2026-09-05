"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from "@phosphor-icons/react";
import { formatCurrency } from "@/data/pricing";
import { MobileBackHeader } from "@/components/mobile-back-header";

type Order = {
  order_number: string; status: string; payment_status: string; payment_method: string;
  customer_name: string; customer_email: string; customer_phone: string; recipient_name: string; recipient_phone: string;
  shipping_address: string; shipping_note: string; subtotal_vnd: number; shipping_fee_vnd: number; discount_vnd: number; total_vnd: number; coupon_code?: string | null; shipping_provider?: string; tracking_code?: string; created_at: string;
  order_items: Array<{ id: string; product_name: string; quantity: number; unit_price_vnd: number; line_total_vnd: number }>;
  order_status_history: Array<{ id: string; from_status?: string | null; to_status: string; note: string; created_at: string }>;
};

const labels: Record<string, string> = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", packing: "Đang chuẩn bị", shipping: "Đang giao hàng", delivered: "Đã giao", cancelled: "Đã hủy" };
const icons = { pending: Clock, confirmed: CheckCircle, packing: Package, shipping: Truck, delivered: CheckCircle, cancelled: Clock };

export function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/v1/orders/${orderId}`, { cache: "no-store" })
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => { if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Không thể tải đơn hàng."); setOrder(payload.data); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Không thể tải đơn hàng."))
      .finally(() => setLoading(false));
  }, [orderId]);

  return <main className="section !pt-0 pb-[calc(env(safe-area-inset-bottom)+120px)] md:pt-14 md:pb-24"><MobileBackHeader href="/ca-nhan" section="Đơn hàng" title="Chi tiết đơn hàng" /><div className="container max-w-4xl">{loading ? <div className="mt-8 h-64 animate-pulse rounded-[28px] bg-[rgba(15,77,50,0.08)]" /> : error ? <div className="mt-8 rounded-[24px] bg-white p-6 text-sm text-[#8b3030]">{error}<Link href="/ca-nhan" className="mt-4 inline-flex font-semibold text-[var(--green)]">Về trang cá nhân</Link></div> : order ? <><div className="mt-6 flex items-end justify-between gap-4"><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Đơn hàng</div><h1 className="mt-2 text-3xl font-semibold text-[var(--green-dark)] md:text-5xl">{order.order_number}</h1></div><div className="rounded-full bg-[rgba(15,77,50,0.08)] px-3 py-2 text-xs font-semibold text-[var(--green-dark)]">{labels[order.status] || order.status}</div></div><section className="mt-6 rounded-[28px] bg-white p-5 shadow-[0_12px_28px_rgba(15,77,50,0.07)] md:p-8"><h2 className="text-xl font-semibold text-[var(--green-dark)]">Trạng thái đơn hàng</h2><div className="mt-5 space-y-4">{order.order_status_history?.map((item) => { const Icon = icons[item.to_status as keyof typeof icons] || Clock; return <div key={item.id} className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(15,77,50,0.08)] text-[var(--green)]"><Icon size={18} weight="bold" /></div><div><div className="text-sm font-semibold text-[var(--green-dark)]">{labels[item.to_status] || item.to_status}</div><div className="mt-1 text-xs text-[var(--muted)]">{new Date(item.created_at).toLocaleString("vi-VN")}{item.note ? ` · ${item.note}` : ""}</div></div></div>; })}</div></section><div className="mt-5 grid gap-5 md:grid-cols-2"><section className="rounded-[28px] bg-white p-5 shadow-[0_12px_28px_rgba(15,77,50,0.07)] md:p-7"><h2 className="text-xl font-semibold text-[var(--green-dark)]">Sản phẩm</h2><div className="mt-4 divide-y divide-[rgba(15,77,50,0.08)]">{order.order_items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0"><div className="min-w-0"><div className="truncate text-sm font-semibold text-[var(--green-dark)]">{item.product_name}</div><div className="mt-1 text-xs text-[var(--muted)]">{item.quantity} x {formatCurrency(item.unit_price_vnd)}</div></div><div className="shrink-0 text-sm font-semibold text-[var(--green)]">{formatCurrency(item.line_total_vnd)}</div></div>)}</div><div className="mt-4 space-y-2 border-t border-[rgba(15,77,50,0.08)] pt-4 text-sm"><div className="flex justify-between"><span>Tạm tính</span><span>{formatCurrency(order.subtotal_vnd)}</span></div><div className="flex justify-between"><span>Phí giao hàng</span><span>{formatCurrency(order.shipping_fee_vnd)}</span></div><div className="flex justify-between font-semibold text-[var(--green-dark)]"><span>Tổng cộng</span><span>{formatCurrency(order.total_vnd)}</span></div></div></section><section className="rounded-[28px] bg-white p-5 shadow-[0_12px_28px_rgba(15,77,50,0.07)] md:p-7"><h2 className="text-xl font-semibold text-[var(--green-dark)]">Giao hàng & thanh toán</h2><div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]"><p><strong className="text-[var(--green-dark)]">Người nhận:</strong> {order.recipient_name} · {order.recipient_phone}</p><p><strong className="text-[var(--green-dark)]">Địa chỉ:</strong> {order.shipping_address}</p><p><strong className="text-[var(--green-dark)]">Thanh toán:</strong> {order.payment_method === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản ngân hàng"} · {order.payment_status === "paid" ? "Đã thanh toán" : "Chờ xác nhận"}</p>{order.shipping_note ? <p><strong className="text-[var(--green-dark)]">Ghi chú:</strong> {order.shipping_note}</p> : null}</div></section></div></> : null}</div></main>;
}
