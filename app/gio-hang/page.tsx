"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CartItem } from "@/components/cart-store";
import { clearCart, readCart, readCheckoutInfo, removeItem, saveCheckoutInfo, setItemQuantity, subscribeCart } from "@/components/cart-store";
import { formatCurrency } from "@/data/pricing";
import type { AuthUser } from "@/components/auth-store";
import { isMockAdminUser, readAuthUser, saveAuthUser, subscribeAuth } from "@/components/auth-store";
import { useToast } from "@/components/toast";

const couponCatalog = {
  HOAPHUC5: { label: "Giảm 5%", type: "percent" as const, value: 0.05, minSubtotal: 0, note: "Áp dụng cho mọi đơn hàng" },
  FREESHIP200: { label: "Miễn phí ship", type: "shipping" as const, value: 30000, minSubtotal: 200000, note: "Đơn từ 200.000đ" },
  HOAPHUC10: { label: "Giảm 10%", type: "percent" as const, value: 0.1, minSubtotal: 1000000, note: "Đơn từ 1.000.000đ" },
};

type CouponState = {
  code: string;
  error: string;
  appliedCode: keyof typeof couponCatalog | "";
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(() => readCheckoutInfo());
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [coupon, setCoupon] = useState<CouponState>({ code: "", error: "", appliedCode: "" });
  const { showToast } = useToast();

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();
    return subscribeCart(syncCart);
  }, []);

  useEffect(() => {
    const syncAuth = () => setAuthUser(readAuthUser());
    syncAuth();
    return subscribeAuth(syncAuth);
  }, []);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const appliedCoupon = coupon.appliedCode ? couponCatalog[coupon.appliedCode] : null;
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(subtotal * appliedCoupon.value)
      : Math.min(shipping, appliedCoupon.value)
    : 0;
  const shippingAfterDiscount = appliedCoupon?.type === "shipping" ? Math.max(0, shipping - discount) : shipping;
  const total = subtotal + shippingAfterDiscount - (appliedCoupon?.type === "percent" ? discount : 0);

  const handleChange = (field: keyof typeof form, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    saveCheckoutInfo(next);
  };

  const handleSubmit = () => {
    if (!items.length) return;
    setSubmitted(true);
  };

  const applyCoupon = () => {
    const raw = coupon.code.trim().toUpperCase();
    if (!raw) {
      setCoupon((current) => ({ ...current, error: "Nhập mã giảm giá nếu bạn có." }));
      return;
    }

    const found = couponCatalog[raw as keyof typeof couponCatalog];
    if (!found) {
      setCoupon((current) => ({ ...current, error: "Mã giảm giá không hợp lệ." }));
      return;
    }

    if (subtotal < found.minSubtotal) {
      setCoupon((current) => ({
        ...current,
        error: `Mã này áp dụng cho đơn từ ${formatCurrency(found.minSubtotal)}.`,
      }));
      return;
    }

    setCoupon({ code: raw, error: "", appliedCode: raw as keyof typeof couponCatalog });
    showToast({
      title: "Đã áp dụng mã giảm giá",
      message: `${found.label} được kích hoạt thành công.`,
    });
  };

  const removeCoupon = () => {
    setCoupon({ code: "", error: "", appliedCode: "" });
    showToast({ title: "Đã xoá mã giảm giá" });
  };

  return (
    <main className="section !pt-0 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <div className="container">
        <div className="md:hidden">
          <div className="-mx-4 sticky top-0 z-40 border-b border-[rgba(15,77,50,0.08)] bg-[rgba(255,255,255,0.92)]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)] shadow-[0_10px_18px_rgba(15,77,50,0.08)]"
                aria-label="Quay lại trang chủ"
              >
                <span className="text-[18px] leading-none">‹</span>
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Giỏ hàng</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">Thanh toán đơn hàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section>
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Giỏ hàng
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Thanh toán đơn hàng</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Hoàn tất đơn hàng nhanh gọn với trải nghiệm mua sắm rõ ràng, tiện lợi và phù hợp cho khách hàng Hòa Phúc.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              "Xem lại sản phẩm đã chọn trước khi đặt",
              "Điền thông tin giao hàng trong vài bước",
              "Áp dụng mã ưu đãi nếu bạn có",
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
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Tài khoản mua hàng
            </div>
            {authUser ? (
              <div className="mt-4 rounded-[24px] bg-[rgba(15,77,50,0.06)] p-5">
                <div className="text-lg font-semibold text-[var(--green-dark)]">Xin chào, {authUser.name || "thành viên"}</div>
                <div className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Bạn đang đăng nhập bằng <span className="font-semibold text-[var(--green-dark)]">{authUser.email}</span>.
                  Có thể mua nhanh với dữ liệu đã lưu sẵn.
                </div>
                {isMockAdminUser(authUser) ? (
                  <div className="mt-3 inline-flex rounded-full bg-[rgba(15,77,50,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--green-dark)]">
                    Tài khoản quản trị
                  </div>
                ) : null}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    className="button button-primary justify-center"
                    onClick={() => {
                      handleChange("name", authUser.name);
                      handleChange("phone", authUser.phone);
                    }}
                  >
                    Dùng thông tin tài khoản
                  </button>
                  <button
                    className="button button-secondary justify-center"
                    onClick={() => setAuthUser(null)}
                  >
                    Dùng khách lẻ
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.04)] p-5">
                <div className="text-sm font-semibold text-[var(--green-dark)]">Bạn đã có tài khoản?</div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Đăng nhập để mua nhanh, lưu địa chỉ và theo dõi đơn hàng dễ hơn.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link href="/dang-nhap" className="button button-primary justify-center">
                    Đăng nhập để mua nhanh
                  </Link>
                  <Link href="/dang-ky-thanh-vien" className="button button-secondary justify-center">
                    Đăng ký tài khoản
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="card rounded-[32px] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[var(--green-dark)]">Thông tin nhận hàng</h2>
            <div className="mt-5 grid gap-4">
              <input className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Họ và tên" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              <input className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Số điện thoại" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              <input className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Địa chỉ giao hàng" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
              <textarea className="min-h-28 rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none" placeholder="Ghi chú" value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
            </div>
            <div className="mt-5 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] p-4">
              <div className="text-sm font-semibold text-[var(--green-dark)]">Mã giảm giá</div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  className="min-w-0 flex-1 rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/90 px-4 py-3 text-sm uppercase outline-none"
                  placeholder="Nhập mã nếu có"
                  value={coupon.code}
                  onChange={(e) => setCoupon((current) => ({ ...current, code: e.target.value, error: "" }))}
                />
                <button className="button button-secondary justify-center sm:w-[140px]" onClick={applyCoupon} type="button">
                  Áp dụng
                </button>
              </div>
              {coupon.error ? <div className="mt-2 text-xs leading-6 text-[#c85046]">{coupon.error}</div> : null}
              {appliedCoupon ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-white px-4 py-3 text-sm text-[var(--green-dark)] shadow-[0_8px_18px_rgba(15,77,50,0.06)]">
                  <div>
                    <div className="font-semibold uppercase tracking-[0.14em] text-[var(--green)]">{coupon.appliedCode}</div>
                    <div className="mt-1 text-xs leading-6 text-[var(--muted)]">{appliedCoupon.note}</div>
                  </div>
                  <button type="button" className="text-sm font-semibold text-[var(--green-dark)] underline" onClick={removeCoupon}>
                    Bỏ mã
                  </button>
                </div>
              ) : null}
            </div>
            <button className="button button-primary mt-5 w-full justify-center" onClick={handleSubmit} disabled={!items.length}>
              Xác nhận đặt hàng
            </button>
            {submitted ? (
              <div className="mt-4 rounded-[22px] bg-[rgba(15,77,50,0.08)] p-4 text-sm leading-7 text-[var(--green-dark)]">
                Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ tiếp tục hoàn thiện luồng xác nhận và giao hàng trong các bước sau.
              </div>
            ) : null}
            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
              Mẹo nhỏ: giữ form ngắn gọn để khách có thể hoàn tất đặt hàng nhanh hơn trên mobile.
            </p>
          </section>

          <section className="card rounded-[32px] p-6 md:p-8">
            <h3 className="text-xl font-semibold text-[var(--green-dark)]">Tóm tắt đơn hàng</h3>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Phí giao hàng</span><span>{formatCurrency(shipping)}</span></div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between">
                  <span>Giảm giá ({coupon.appliedCode})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              ) : null}
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
