"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, readCart, readCheckoutInfo, removeItem, saveCheckoutInfo, setItemQuantity, subscribeCart } from "@/components/cart-store";
import { formatCurrency } from "@/data/pricing";

export default function CartPage() {
  const [tick, setTick] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(() => readCheckoutInfo());

  useEffect(() => subscribeCart(() => setTick((value) => value + 1)), []);

  const items = useMemo(() => readCart(), [tick]);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const handleChange = (field: keyof typeof form, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    saveCheckoutInfo(next);
  };

  const handleSubmit = () => {
    if (!items.length) return;
    setSubmitted(true);
  };

  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <div className="container grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section>
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Giỏ hàng
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Thanh toán đơn hàng</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Hoàn tất đơn hàng mô phỏng ngay trên website. Thông tin được lưu local để sau này có thể chuyển sang API đặt hàng hoặc cổng thanh toán thật.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              "Xác nhận nhanh qua fanpage / Zalo",
              "Lưu thông tin nhận hàng local",
              "Sẵn sàng nối thanh toán thật sau này",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-4 text-sm leading-7 text-[var(--green-dark)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {items.length === 0 ? (
              <div className="card rounded-[28px] p-8 text-center text-sm text-[var(--muted)]">
                Giỏ hàng đang trống. <Link href="/san-pham" className="font-semibold text-[var(--green-dark)] underline">Xem sản phẩm</Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.slug} className="card flex gap-4 rounded-[28px] p-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#edd9ad,#d4ae6a)]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[var(--green-dark)]">{item.name}</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">{formatCurrency(item.price)}</div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button className="pill border border-[rgba(15,77,50,0.12)] px-3 py-1 text-sm" onClick={() => setItemQuantity(item.slug, item.quantity - 1)}>-</button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button className="pill border border-[rgba(15,77,50,0.12)] px-3 py-1 text-sm" onClick={() => setItemQuantity(item.slug, item.quantity + 1)}>+</button>
                      <button className="ml-auto text-sm font-semibold text-[var(--green-dark)] underline" onClick={() => removeItem(item.slug)}>Xóa</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card rounded-[32px] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[var(--green-dark)]">Thông tin nhận hàng</h2>
            <div className="mt-5 grid gap-4">
              <input className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Họ và tên" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              <input className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Số điện thoại" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              <input className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Địa chỉ giao hàng" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
              <textarea className="min-h-28 rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Ghi chú" value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
            </div>
            <button className="button button-primary mt-5 w-full justify-center" onClick={handleSubmit} disabled={!items.length}>
              Xác nhận đặt hàng
            </button>
            {submitted ? (
              <div className="mt-4 rounded-[22px] bg-[rgba(15,77,50,0.08)] p-4 text-sm leading-7 text-[var(--green-dark)]">
                Đơn hàng mô phỏng đã được tạo. Bạn có thể kết nối bước tiếp theo sang Zalo/Facebook hoặc API đơn hàng thật.
              </div>
            ) : null}
            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
              Mẹo tăng tỉ lệ chốt: rút ngắn form hơn nữa khi bật luồng checkout thật, chỉ giữ họ tên, số điện thoại và địa chỉ.
            </p>
          </section>

          <section className="card rounded-[32px] p-6 md:p-8">
            <h3 className="text-xl font-semibold text-[var(--green-dark)]">Tóm tắt đơn hàng</h3>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Phí giao hàng</span><span>{formatCurrency(shipping)}</span></div>
              <div className="flex items-center justify-between border-t border-[rgba(15,77,50,0.12)] pt-3 text-base font-semibold text-[var(--green-dark)]"><span>Tổng cộng</span><span>{formatCurrency(total)}</span></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/san-pham" className="button button-secondary">Tiếp tục mua</Link>
              <button className="button button-secondary" onClick={clearCart}>Xóa giỏ</button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
