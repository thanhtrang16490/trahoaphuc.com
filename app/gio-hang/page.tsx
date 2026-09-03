"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Plus, ShoppingBagOpen, ShoppingCartSimple, Tag, X } from "@phosphor-icons/react";
import type { CartItem } from "@/components/cart-store";
import { addProductToCart, clearCart, readCart, readCheckoutInfo, removeItem, saveCheckoutInfo, setItemQuantity, subscribeCart } from "@/components/cart-store";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { products } from "@/data/products";
import type { AuthUser } from "@/components/auth-store";
import { isMockAdminUser, readAuthUser, saveAuthUser, subscribeAuth } from "@/components/auth-store";
import { useToast } from "@/components/toast";
import { MobileBackHeader } from "@/components/mobile-back-header";
import { ModalShell } from "@/components/modal-shell";

const couponCatalog = {
  HOAPHUC5: { label: "Giảm 5%", type: "percent" as const, value: 0.05, minSubtotal: 0, note: "Áp dụng cho mọi đơn hàng" },
  FREESHIP200: { label: "Miễn phí ship", type: "shipping" as const, value: 30000, minSubtotal: 200000, note: "Đơn từ 200.000đ" },
  HOAPHUC10: { label: "Giảm 10%", type: "percent" as const, value: 0.1, minSubtotal: 1000000, note: "Đơn từ 1.000.000đ" },
  HOAPHUC15: { label: "Giảm 15%", type: "percent" as const, value: 0.15, minSubtotal: 1500000, note: "Ưu đãi thành viên, đơn từ 1.500.000đ" },
  HOAPHUC100: { label: "Giảm 100.000đ", type: "fixed" as const, value: 100000, minSubtotal: 500000, note: "Voucher quà tặng, đơn từ 500.000đ" },
  HOAPHUCBI: { label: "Giảm 50.000đ", type: "fixed" as const, value: 50000, minSubtotal: 300000, note: "Mã bí mật, đơn từ 300.000đ" },
};

const couponSources = {
  HOAPHUC5: "Mã dành cho khách mới",
  FREESHIP200: "Mã vận chuyển của Hòa Phúc",
  HOAPHUC10: "Mã thành viên thân thiết",
  HOAPHUC15: "Mã thành viên thân thiết",
  HOAPHUC100: "Voucher quà tặng từ vòng quay",
  HOAPHUCBI: "Mã bí mật từ vòng quay",
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
  const [couponPickerOpen, setCouponPickerOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddQuery, setQuickAddQuery] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      : appliedCoupon.type === "shipping"
        ? Math.min(shipping, appliedCoupon.value)
        : Math.min(subtotal, appliedCoupon.value)
    : 0;
  const shippingAfterDiscount = appliedCoupon?.type === "shipping" ? Math.max(0, shipping - discount) : shipping;
  const total = subtotal + shippingAfterDiscount - (appliedCoupon?.type === "percent" || appliedCoupon?.type === "fixed" ? discount : 0);

  const handleChange = (field: keyof typeof form, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (formError) setFormError("");
    saveCheckoutInfo(next);
  };

  const validateCheckout = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setFormError("Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng.");
      const firstMissing = !form.name.trim() ? "checkout-name" : !form.phone.trim() ? "checkout-phone" : "checkout-address";
      document.getElementById(firstMissing)?.focus();
      return false;
    }
    if (!/^(0|\+84)\d{8,10}$/.test(form.phone.replace(/[.\s-]/g, ""))) {
      setFormError("Số điện thoại chưa đúng định dạng. Bạn hãy kiểm tra lại nhé.");
      document.getElementById("checkout-phone")?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!items.length) return;
    if (!validateCheckout()) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast({ title: "Đã ghi nhận đơn hàng", message: "Hòa Phúc sẽ liên hệ để xác nhận thông tin giao hàng." });
    }, 500);
  };

  const applyCouponCode = (value: string) => {
    const raw = value.trim().toUpperCase();
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
    setCouponPickerOpen(false);
    showToast({
      title: "Đã áp dụng mã giảm giá",
      message: `${found.label} được kích hoạt thành công.`,
    });
  };

  const applyCoupon = () => applyCouponCode(coupon.code);

  const addQuickProduct = (slug: string) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    addProductToCart(product);
    showToast({ title: "Đã thêm vào giỏ hàng", message: `${product.name} · Số lượng đã cập nhật.` });
  };

  const quickAddProducts = products.filter((product) =>
    [product.name, product.category].join(" ").toLowerCase().includes(quickAddQuery.trim().toLowerCase()),
  );

  const removeCoupon = () => {
    setCoupon({ code: "", error: "", appliedCode: "" });
    showToast({ title: "Đã xoá mã giảm giá" });
  };

  return (
    <main className="section !overflow-x-clip !pt-0 pb-[calc(env(safe-area-inset-bottom)+160px)] md:overflow-visible md:pt-14 md:pb-24">
      <MobileBackHeader href="/" section="Giỏ hàng" title="Thanh toán đơn hàng" />
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

          <div className="mt-8 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Sản phẩm đã chọn</div>
              <div className="mt-1 text-sm text-[var(--muted)]">{items.length} sản phẩm trong giỏ</div>
            </div>
            <button
              type="button"
              onClick={() => setQuickAddOpen(true)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--green)] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(15,77,50,0.16)] transition-transform active:scale-[0.98]"
            >
              <Plus size={17} weight="bold" /> Thêm sản phẩm
            </button>
          </div>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="card rounded-[28px] p-8 text-center">
                <ShoppingBagOpen size={34} weight="duotone" className="mx-auto text-[var(--green)]" />
                <div className="mt-3 text-sm text-[var(--muted)]">Giỏ hàng đang trống.</div>
                <button type="button" onClick={() => setQuickAddOpen(true)} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--green)] px-4 text-sm font-semibold text-white">
                  <Plus size={16} weight="bold" /> Thêm sản phẩm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.slug} className="card flex gap-4 rounded-[28px] p-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#edd9ad,#d4ae6a)]">
                    <Image src={item.image} alt={item.name} width={96} height={96} sizes="96px" className="h-full w-full object-contain" />
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
              <input id="checkout-name" required autoComplete="name" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Họ và tên *" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              <input id="checkout-phone" required inputMode="tel" autoComplete="tel" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Số điện thoại *" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              <input id="checkout-address" required autoComplete="street-address" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Địa chỉ giao hàng *" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
              <textarea autoComplete="off" className="min-h-28 rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Ghi chú cho người giao hàng (không bắt buộc)" value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
            </div>
            {formError ? <div role="alert" className="mt-3 rounded-[14px] bg-[rgba(200,80,70,0.08)] px-3 py-2 text-sm leading-6 text-[#b44840]">{formError}</div> : null}
            <div className="mt-5 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--green-dark)]"><Tag size={18} weight="duotone" className="text-[var(--green)]" /> Mã giảm giá</div>
                <button type="button" onClick={() => setCouponPickerOpen(true)} className="text-xs font-semibold text-[var(--green)] underline underline-offset-4">Xem mã có sẵn</button>
              </div>
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
            <button className="button button-primary mt-5 w-full justify-center" onClick={handleSubmit} disabled={!items.length || submitted || isSubmitting}>
              {isSubmitting ? "Đang ghi nhận..." : submitted ? "Đã ghi nhận" : "Xác nhận đặt hàng"}
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs leading-5 text-[var(--muted)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(15,77,50,0.08)] text-[var(--green)]">✓</span>
              Thanh toán khi nhận hàng. Hòa Phúc sẽ gọi xác nhận trước khi gửi.
            </div>
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

      {items.length ? (
        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+58px)] z-30 px-3 md:hidden">
          <div className="mx-auto flex max-w-screen-sm items-center gap-3 rounded-[20px] border border-white/70 bg-[rgba(255,255,255,0.88)] px-3 py-2 shadow-[0_16px_36px_rgba(15,77,50,0.18)] backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Tổng thanh toán</div>
              <div className="mt-0.5 truncate text-[17px] font-semibold text-[var(--green-dark)]">{formatCurrency(total)}</div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitted || isSubmitting}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[14px] bg-[var(--green)] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,77,50,0.16)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <ShoppingCartSimple size={18} weight="bold" className={isSubmitting ? "animate-pulse" : ""} /> {isSubmitting ? "Đang xử lý..." : submitted ? "Đã ghi nhận" : "Đặt hàng"}
            </button>
          </div>
        </div>
      ) : null}

      {couponPickerOpen ? (
        <ModalShell eyebrow="Ưu đãi của bạn" title="Chọn mã giảm giá" onClose={() => setCouponPickerOpen(false)} className="max-w-lg">
            <div className="mt-5 space-y-3">
              {Object.entries(couponCatalog).map(([code, offer]) => {
                const eligible = subtotal >= offer.minSubtotal;
                return (
                  <button
                    key={code}
                    type="button"
                    disabled={!eligible}
                    onClick={() => applyCouponCode(code)}
                    className={`flex w-full items-center gap-3 rounded-[20px] border p-3 text-left transition-transform active:scale-[0.99] ${eligible ? "border-[rgba(15,77,50,0.14)] bg-white hover:-translate-y-0.5" : "border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.04)] opacity-55"}`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(15,77,50,0.08)] text-[var(--green)]"><Tag size={22} weight="duotone" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--green-dark)]">{code}</span>
                      <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{offer.label} · {eligible ? couponSources[code as keyof typeof couponSources] : `Cần đơn từ ${formatCurrency(offer.minSubtotal)}`}</span>
                    </span>
                    {eligible ? <Check size={19} weight="bold" className="text-[var(--green)]" /> : null}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Mã mock dành cho trải nghiệm thử nghiệm, điều kiện sẽ được kiểm tra theo giá trị đơn hàng hiện tại.</p>
        </ModalShell>
      ) : null}

      {quickAddOpen ? (
        <ModalShell eyebrow="Mua nhanh" title="Thêm sản phẩm vào giỏ" onClose={() => setQuickAddOpen(false)}>
            <div className="border-b border-[rgba(15,77,50,0.08)] px-5 py-3">
              <input autoFocus value={quickAddQuery} onChange={(event) => setQuickAddQuery(event.target.value)} placeholder="Tìm trà hoặc đặc sản..." className="h-11 w-full rounded-[16px] border border-[rgba(15,77,50,0.12)] bg-white px-4 text-sm text-[var(--green-dark)] outline-none focus:border-[var(--green)]" />
            </div>
            <div className="grid gap-3 overflow-y-auto p-5 sm:grid-cols-2">
              {quickAddProducts.length ? quickAddProducts.map((product) => (
                <div key={product.slug} className="flex gap-3 rounded-[20px] border border-[rgba(15,77,50,0.1)] bg-white p-3 shadow-[0_8px_20px_rgba(15,77,50,0.05)]">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[15px] bg-[linear-gradient(180deg,#f2e4c9,#dfc18e)]"><Image src={product.image} alt={product.name} fill sizes="80px" className="object-contain" /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--green-dark)]">{product.name}</h3>
                    <div className="mt-1 text-sm font-semibold text-[var(--green)]">{formatCurrency(getProductPrice(product.slug))}</div>
                    <button type="button" onClick={() => addQuickProduct(product.slug)} className="mt-2 inline-flex h-8 items-center gap-1 rounded-full bg-[var(--green)] px-3 text-xs font-semibold text-white"><Plus size={14} weight="bold" /> Thêm</button>
                  </div>
                </div>
              )) : <div className="col-span-full py-8 text-center text-sm text-[var(--muted)]">Không tìm thấy sản phẩm phù hợp.</div>}
            </div>
        </ModalShell>
      ) : null}
    </main>
  );
}
