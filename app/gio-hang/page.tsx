"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, Plus, ShoppingBagOpen, ShoppingCartSimple, Tag, X } from "@phosphor-icons/react";
import type { CartItem } from "@/components/cart-store";
import { addProductToCart, clearCart, readCart, readCheckoutInfo, removeItem, saveCheckoutInfo, setItemQuantity, subscribeCart } from "@/components/cart-store";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { products as localProducts, type Product } from "@/data/products";
import { couponCatalog as localCouponCatalog, type CouponCatalog, type CouponOffer } from "@/data/coupons";
import type { AuthUser } from "@/components/auth-store";
import { isMockAdminUser, readAuthUser, saveAuthUser, subscribeAuth } from "@/components/auth-store";
import { useToast } from "@/components/toast";
import { MobileBackHeader } from "@/components/mobile-back-header";
import { ModalShell } from "@/components/modal-shell";
import { vietnamProvinces } from "@/data/vietnam-address";

type CouponState = {
  code: string;
  error: string;
  appliedCode: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(() => readCheckoutInfo());
  const [differentRecipient, setDifferentRecipient] = useState(false);
  const [recipient, setRecipient] = useState({ name: "", phone: "", province: "", ward: "", address: "", note: "" });
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<CouponCatalog>(localCouponCatalog);
  const [coupon, setCoupon] = useState<CouponState>({ code: "", error: "", appliedCode: "" });
  const [couponPickerOpen, setCouponPickerOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddQuery, setQuickAddQuery] = useState("");
  const [formError, setFormError] = useState("");
  const [cartIssue, setCartIssue] = useState("");
  const [cartChecking, setCartChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [locationData, setLocationData] = useState<Array<{ code: number; name: string; wards: Array<{ code: number; name: string }> }>>([]);
  const [orderResult, setOrderResult] = useState<{ order_number: string; total_vnd: number; payment_method: string } | null>(null);
  const idempotencyKeyRef = useRef<string>("");
  const { showToast } = useToast();
  const selectedProvince = locationData.find((item) => item.name === form.province);

  useEffect(() => {
    fetch("/api/v1/locations", { cache: "force-cache" }).then((response) => response.json()).then((payload) => { if (payload?.ok && Array.isArray(payload.data)) setLocationData(payload.data); }).catch(() => undefined);
  }, []);

  const cartSignature = items.map((item) => `${item.slug}:${item.quantity}`).join("|");

  useEffect(() => {
    if (!items.length) {
      setCartIssue("");
      setCartChecking(false);
      return;
    }

    let active = true;
    setCartChecking(true);
    fetch("/api/v1/cart/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })) }),
    })
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (!active) return;
        if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Chưa thể kiểm tra sản phẩm.");
        const serverItems = Array.isArray(payload.data?.items) ? payload.data.items : [];
        const unavailable = serverItems.filter((item: { available?: boolean }) => !item.available);
        setItems((current) => current.map((item) => {
          const serverItem = serverItems.find((candidate: { slug?: string }) => candidate.slug === item.slug);
          return serverItem ? { ...item, name: serverItem.name || item.name, image: serverItem.image || item.image, price: Number(serverItem.price) || item.price } : item;
        }));
        setCartIssue(unavailable.length ? "Một sản phẩm đã thay đổi giá hoặc không còn đủ tồn kho. Vui lòng kiểm tra lại trước khi đặt hàng." : "");
      })
      .catch((error) => {
        if (active) setCartIssue(error instanceof Error ? error.message : "Chưa thể kiểm tra giá và tồn kho.");
      })
      .finally(() => {
        if (active) setCartChecking(false);
      });

    return () => {
      active = false;
    };
  }, [cartSignature]);

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();
    return subscribeCart(syncCart);
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/v1/coupons", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!active || !payload?.ok || !Array.isArray(payload.data)) return;
        setAvailableCoupons(
          Object.fromEntries(payload.data.map((offer: CouponOffer & { code: string }) => [offer.code, offer])) as CouponCatalog,
        );
      })
      .catch(() => {
        // Keep local voucher data if the API is temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const syncAuth = () => setAuthUser(readAuthUser());
    syncAuth();
    return subscribeAuth(syncAuth);
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/v1/products?limit=50", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (active && payload?.ok && Array.isArray(payload.data?.items)) {
          setProducts(payload.data.items as Product[]);
        }
      })
      .catch(() => {
        // Keep the local catalog if the API is temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, []);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const appliedCoupon = coupon.appliedCode ? availableCoupons[coupon.appliedCode] : null;
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

  const handleRecipientChange = (field: keyof typeof recipient, value: string) => setRecipient((current) => ({ ...current, [field]: value }));

  const validateCheckout = () => {
    const shipping = differentRecipient ? recipient : form;
    if (!form.name.trim() || !form.phone.trim() || !shipping.province.trim() || !shipping.ward.trim() || !shipping.address.trim() || (differentRecipient && !shipping.name.trim())) {
      setFormError("Vui lòng điền họ tên, số điện thoại, tỉnh/thành, xã/phường và địa chỉ chi tiết.");
      const firstMissing = !form.name.trim() ? "checkout-name" : !form.phone.trim() ? "checkout-phone" : !shipping.province.trim() ? "checkout-province" : !shipping.ward.trim() ? "checkout-ward" : "checkout-address";
      document.getElementById(firstMissing)?.focus();
      return false;
    }
    if (!/^(0|\+84)\d{8,10}$/.test(form.phone.replace(/[.\s-]/g, "")) || !/^(0|\+84)\d{8,10}$/.test(shipping.phone.replace(/[.\s-]/g, ""))) {
      setFormError("Số điện thoại chưa đúng định dạng. Bạn hãy kiểm tra lại nhé.");
      document.getElementById("checkout-phone")?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!items.length) return;
    if (cartChecking || cartIssue) {
      setFormError(cartIssue || "Vui lòng chờ kiểm tra lại giá và tồn kho.");
      return;
    }
    if (!validateCheckout()) return;
    setIsSubmitting(true);
    setFormError("");
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = window.crypto?.randomUUID?.() ?? `hp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    try {
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          recipient: differentRecipient ? recipient : form,
          items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
          couponCode: coupon.appliedCode || null,
          paymentMethod,
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error?.message || "Chưa thể tạo đơn hàng.");
      }

      setOrderResult(payload.data);
      setSubmitted(true);
      clearCart();
      showToast({ title: "Đặt hàng thành công", message: `Mã đơn ${payload.data.order_number}` });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Chưa thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyCouponCode = (value: string) => {
    const raw = value.trim().toUpperCase();
    if (!raw) {
      setCoupon((current) => ({ ...current, error: "Nhập mã giảm giá nếu bạn có." }));
      return;
    }

    const found = availableCoupons[raw];
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

    setCoupon({ code: raw, error: "", appliedCode: raw });
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
                      handleChange("email", authUser.email);
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
            <h2 className="text-2xl font-semibold text-[var(--green-dark)]">Thông tin người đặt hàng</h2>
            <div className="mt-5 grid gap-4">
              <input id="checkout-email" type="email" autoComplete="email" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Email nhận xác nhận đơn (không bắt buộc)" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              <input id="checkout-name" required autoComplete="name" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Họ và tên *" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              <input id="checkout-phone" required inputMode="tel" autoComplete="tel" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Số điện thoại *" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              <label className="flex items-center gap-3 rounded-[18px] bg-[rgba(15,77,50,0.05)] px-4 py-3 text-sm font-semibold text-[var(--green-dark)]"><input type="checkbox" checked={differentRecipient} onChange={(e) => { setDifferentRecipient(e.target.checked); setFormError(""); }} /> Thông tin người nhận khác người đặt hàng</label>
              {!differentRecipient ? <><select id="checkout-province" required autoComplete="address-level1" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" value={form.province} onChange={(e) => handleChange("province", e.target.value)}><option value="">Chọn tỉnh / thành phố *</option>{vietnamProvinces.map((province) => <option key={province} value={province}>{province}</option>)}</select>{selectedProvince?.wards.length ? <select id="checkout-ward" required autoComplete="address-level2" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" value={form.ward} onChange={(e) => handleChange("ward", e.target.value)}><option value="">Chọn xã / phường / đặc khu *</option>{selectedProvince.wards.map((ward) => <option key={ward.code} value={ward.name}>{ward.name}</option>)}</select> : <input id="checkout-ward" required autoComplete="address-level2" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Nhập xã / phường / đặc khu *" value={form.ward} onChange={(e) => handleChange("ward", e.target.value)} />}<input id="checkout-address" required autoComplete="street-address" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Địa chỉ giao hàng *" value={form.address} onChange={(e) => handleChange("address", e.target.value)} /></> : <div className="space-y-4 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] p-4"><div className="text-sm font-semibold text-[var(--green-dark)]">Thông tin người nhận</div><input required name="recipient-name" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Tên người nhận *" value={recipient.name} onChange={(e) => handleRecipientChange("name", e.target.value)} /><input required inputMode="tel" className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Số điện thoại người nhận *" value={recipient.phone} onChange={(e) => handleRecipientChange("phone", e.target.value)} /><select required className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" value={recipient.province} onChange={(e) => handleRecipientChange("province", e.target.value)}><option value="">Chọn tỉnh / thành phố *</option>{vietnamProvinces.map((province) => <option key={province} value={province}>{province}</option>)}</select><input required className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Xã / phường / đặc khu *" value={recipient.ward} onChange={(e) => handleRecipientChange("ward", e.target.value)} /><input required className="rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Địa chỉ giao hàng *" value={recipient.address} onChange={(e) => handleRecipientChange("address", e.target.value)} /></div>}
              <textarea autoComplete="off" className="min-h-28 rounded-[18px] border border-[rgba(15,77,50,0.14)] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[var(--green)]" placeholder="Ghi chú cho người giao hàng (không bắt buộc)" value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
            </div>
            {formError ? <div role="alert" className="mt-3 rounded-[14px] bg-[rgba(200,80,70,0.08)] px-3 py-2 text-sm leading-6 text-[#b44840]">{formError}</div> : null}
            {cartIssue ? <div role="alert" className="mt-3 rounded-[14px] bg-[rgba(200,120,30,0.1)] px-3 py-2 text-sm leading-6 text-[#8b5a16]">{cartIssue}</div> : null}
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
            <div className="mt-5 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] p-4">
              <div className="text-sm font-semibold text-[var(--green-dark)]">Phương thức thanh toán</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`rounded-[18px] border p-4 text-left transition-colors ${paymentMethod === "cod" ? "border-[var(--green)] bg-white shadow-[0_8px_18px_rgba(15,77,50,0.08)]" : "border-[rgba(15,77,50,0.1)] bg-white/55"}`}
                >
                  <div className="text-sm font-semibold text-[var(--green-dark)]">Thanh toán khi nhận hàng</div>
                  <div className="mt-1 text-xs leading-5 text-[var(--muted)]">Kiểm tra hàng và thanh toán cho đơn vị giao hàng.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={`rounded-[18px] border p-4 text-left transition-colors ${paymentMethod === "bank_transfer" ? "border-[var(--green)] bg-white shadow-[0_8px_18px_rgba(15,77,50,0.08)]" : "border-[rgba(15,77,50,0.1)] bg-white/55"}`}
                >
                  <div className="text-sm font-semibold text-[var(--green-dark)]">Chuyển khoản ngân hàng</div>
                  <div className="mt-1 text-xs leading-5 text-[var(--muted)]">Hòa Phúc gửi thông tin chuyển khoản sau khi tiếp nhận đơn.</div>
                </button>
              </div>
            </div>
            <button className="button button-primary mt-5 w-full justify-center" onClick={handleSubmit} disabled={!items.length || submitted || isSubmitting || cartChecking || Boolean(cartIssue)}>
              {isSubmitting ? "Đang tạo đơn..." : cartChecking ? "Đang kiểm tra sản phẩm..." : submitted ? "Đã đặt hàng" : "Xác nhận đặt hàng"}
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs leading-5 text-[var(--muted)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(15,77,50,0.08)] text-[var(--green)]">✓</span>
              {paymentMethod === "cod" ? "Thanh toán khi nhận hàng. Hòa Phúc sẽ gọi xác nhận trước khi gửi." : "Đơn chuyển khoản sẽ được xác nhận sau khi Hòa Phúc kiểm tra giao dịch."}
            </div>
            {orderResult ? (
              <div className="mt-4 rounded-[22px] bg-[rgba(15,77,50,0.08)] p-4 text-sm leading-7 text-[var(--green-dark)]">
                <div className="font-semibold">Đặt hàng thành công</div>
                <div className="mt-1">Mã đơn: <strong>{orderResult.order_number}</strong></div>
                <div>Tổng thanh toán: <strong>{formatCurrency(orderResult.total_vnd)}</strong></div>
                <div className="mt-2 text-xs leading-6 text-[var(--muted)]">Hòa Phúc sẽ liên hệ để xác nhận thông tin giao hàng và trạng thái thanh toán.</div>
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
              disabled={submitted || isSubmitting || cartChecking || Boolean(cartIssue)}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[14px] bg-[var(--green)] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,77,50,0.16)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <ShoppingCartSimple size={18} weight="bold" className={isSubmitting || cartChecking ? "animate-pulse" : ""} /> {isSubmitting ? "Đang xử lý..." : cartChecking ? "Đang kiểm tra..." : submitted ? "Đã ghi nhận" : "Đặt hàng"}
            </button>
          </div>
        </div>
      ) : null}

      {couponPickerOpen ? (
        <ModalShell eyebrow="Ưu đãi của bạn" title="Chọn mã giảm giá" onClose={() => setCouponPickerOpen(false)} className="max-w-lg">
            <div className="mt-5 space-y-3">
              {Object.entries(availableCoupons).map(([code, offer]) => {
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
                      <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{offer.label} · {eligible ? offer.source : `Cần đơn từ ${formatCurrency(offer.minSubtotal)}`}</span>
                    </span>
                    {eligible ? <Check size={19} weight="bold" className="text-[var(--green)]" /> : null}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Mã được kiểm tra lại ở server khi tạo đơn để đảm bảo điều kiện và giá trị giảm chính xác.</p>
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
                    <div className="mt-1 text-sm font-semibold text-[var(--green)]">{formatCurrency(product.price ?? getProductPrice(product.slug))}</div>
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
