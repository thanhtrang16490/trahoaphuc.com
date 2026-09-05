"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Clock, Gift, Headset, Package, ShoppingBag, Star, Storefront, Truck } from "@phosphor-icons/react";
import { BreadcrumbJsonLd } from "@/components/seo";
import type { AuthUser } from "@/components/auth-store";
import { clearAuthUser, isMockAdminUser, readAuthUser, subscribeAuth } from "@/components/auth-store";
import { brand } from "@/data/site";
import { formatCurrency } from "@/data/pricing";
import { useMobileScrollVisibility } from "@/components/use-mobile-scroll-visibility";
import { LoyaltyDashboard } from "@/components/loyalty-dashboard";

const orderStates = [
  { label: "Đơn hàng mới", icon: Package },
  { label: "Chờ xác nhận", icon: Clock },
  { label: "Đang giao hàng", icon: Truck },
  { label: "Đánh giá", icon: Star },
];

const utilities = [
  { label: "Hội viên thân thiết", href: "/dang-ky-thanh-vien", icon: Gift },
  { label: "Lịch sử đơn hàng", href: "/gio-hang", icon: ShoppingBag },
  { label: "Đăng ký đại lý", href: "/dang-ky-dai-ly", icon: Storefront },
];

const specialOffers = [
  {
    title: "Giảm 5% cho đơn hàng đầu tiên",
    description: "Áp dụng cho lần đầu mua hàng",
    expiry: "HSD: 01-09-2026",
    icon: "%",
    cta: "Dùng ngay",
  },
  {
    title: "Miễn phí vận chuyển",
    description: "Áp dụng cho đơn hàng từ 200k",
    expiry: "HSD: 01-09-2026",
    icon: "🛵",
    cta: "Dùng ngay",
  },
];

type CustomerOrder = {
  id: string;
  order_number: string;
  status: string;
  total_vnd: number;
  created_at: string;
  order_items?: Array<{ product_name: string; quantity: number }>;
};

const orderStatusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  packing: "Đang chuẩn bị",
  shipping: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default function ProfilePage() {
  const { hidden } = useMobileScrollVisibility();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyTier, setLoyaltyTier] = useState("new");

  useEffect(() => {
    const syncAuth = () => setAuthUser(readAuthUser());
    syncAuth();
    return subscribeAuth(syncAuth);
  }, []);

  useEffect(() => {
    let active = true;
    if (!authUser?.id) {
      setOrders([]);
      setOrdersLoading(false);
      return () => {
        active = false;
      };
    }

    setOrdersLoading(true);
    fetch("/api/v1/orders", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (active && payload?.ok && Array.isArray(payload.data)) {
          setOrders(payload.data as CustomerOrder[]);
        }
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authUser?.id]);

  useEffect(() => {
    let active = true;
    if (!authUser?.id) {
      setLoyaltyPoints(0);
      setLoyaltyTier("new");
      return () => { active = false; };
    }
    fetch("/api/v1/loyalty", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!active || !payload?.ok) return;
        setLoyaltyPoints(Number(payload.data?.account?.points_balance ?? 0));
        setLoyaltyTier(payload.data?.account?.tier ?? "new");
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [authUser?.id]);

  const isLoggedIn = Boolean(authUser);
  const points = isLoggedIn ? loyaltyPoints : 0;
  const avatarLetter = (authUser?.name || "H").trim().charAt(0).toUpperCase();

  const cancelOrder = async (order: CustomerOrder) => {
    if (!window.confirm(`Hủy đơn ${order.order_number}?`)) return;
    setCancellingOrder(order.id);
    try {
      const response = await fetch(`/api/v1/orders/${order.id}`, { method: "PATCH" });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Không thể hủy đơn hàng.");
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "cancelled" } : item));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Không thể hủy đơn hàng.");
    } finally {
      setCancellingOrder(null);
    }
  };

  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Cá nhân", href: "/ca-nhan" }]} />

      <section className="md:hidden">
        <div className={`container transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
          <div className="-mx-4 sticky top-0 z-40 border-b border-[rgba(15,77,50,0.08)] bg-[rgba(255,255,255,0.92)]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                aria-label="Quay lại trang chủ"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)] shadow-[0_10px_18px_rgba(15,77,50,0.08)]"
              >
                <ArrowLeft size={18} weight="bold" />
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Cá nhân</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">Tài khoản của bạn</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container pt-5">
          <article className="overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,#0f4d32,#247447)] p-3 text-white shadow-[0_16px_30px_rgba(15,77,50,0.18)]">
            <div className="rounded-[18px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.16)] text-[18px] font-semibold text-white">
                  {isLoggedIn ? avatarLetter : "🎁"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    {isLoggedIn ? (isMockAdminUser(authUser) ? "Tài khoản quản trị" : "Tài khoản đã đăng nhập") : "Đặc quyền hội viên"}
                  </div>
                  <h1 className="mt-1 text-[22px] font-semibold leading-[1.06] tracking-[-0.03em]">
                    {isLoggedIn ? authUser?.name || "Quý khách hàng" : "Trở thành hội viên"}
                  </h1>
                  {isLoggedIn ? (
                    <div className="mt-1 text-[13px] leading-6 text-white/85">{authUser?.email}</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 rounded-[16px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.12)] p-3">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center justify-between rounded-[14px] bg-[rgba(255,255,255,0.1)] px-3 py-2.5">
                      <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/80">Điểm thưởng</span>
                      <span className="text-[18px] font-semibold leading-none text-white">{points.toLocaleString("vi-VN")} điểm</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <CheckCircle size={16} weight="fill" className="shrink-0 text-[#c9ef63]" />
                      <span>{isMockAdminUser(authUser) ? "Tài khoản quản trị đang hoạt động" : `Hạng ${loyaltyTier === "gold" ? "hội viên vàng" : loyaltyTier === "member" ? "hội viên thân thiết" : "thành viên mới"}`}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[13px] leading-6">
                      <CheckCircle size={16} weight="fill" className="shrink-0 text-[#c9ef63]" />
                      <span>Đang đồng bộ lịch sử đơn và thông tin mua nhanh</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <CheckCircle size={16} weight="fill" className="shrink-0 text-[#c9ef63]" />
                      <span>Đang đăng nhập bằng {authUser?.email}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 text-[13px] leading-6">
                      <CheckCircle size={16} weight="fill" className="shrink-0 text-[#c9ef63]" />
                      <span>Tích luỹ điểm thưởng mỗi đơn hàng</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <CheckCircle size={16} weight="fill" className="shrink-0 text-[#c9ef63]" />
                      <span>Đổi điểm lấy voucher & quà tặng</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <CheckCircle size={16} weight="fill" className="shrink-0 text-[#c9ef63]" />
                      <span>Ưu đãi riêng cho từng hạng thành viên</span>
                    </div>
                  </>
                )}
              </div>

              {isLoggedIn ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/gio-hang"
                    className="flex h-11 items-center justify-center rounded-[14px] bg-white text-[15px] font-semibold text-[var(--green-dark)] shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
                  >
                    Xem giỏ hàng
                  </Link>
                  <button
                    type="button"
                    onClick={clearAuthUser}
                    className="flex h-11 items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.12)] text-[15px] font-semibold text-white"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  href="/dang-ky-thanh-vien"
                  className="mt-3 flex h-11 items-center justify-center rounded-[14px] bg-white text-[15px] font-semibold text-[var(--green-dark)] shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
                >
                  Tham gia ngay <span className="ml-2 text-[18px] leading-none">›</span>
                </Link>
              )}
            </div>
          </article>

          {isLoggedIn ? <section className="mt-4 px-1">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Đơn mua</div>
                <h2 className="mt-2 text-[28px] font-semibold leading-[1.05] text-[var(--green-dark)]">Lịch sử mua hàng</h2>
              </div>
              <Link href="/gio-hang" className="text-sm font-semibold text-[var(--green)]">
                Xem tất cả
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {orderStates.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white px-3 py-4 text-center shadow-[0_12px_28px_rgba(15,77,50,0.08)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(15,77,50,0.06)] text-[24px] text-[var(--green)]">
                    {(() => { const Icon = item.icon; return <Icon size={24} weight="duotone" />; })()}
                  </div>
                  <div className="mt-3 text-[12px] leading-5 text-[var(--green-dark)]">{item.label}</div>
                </div>
              ))}
            </div>
            {isLoggedIn ? (
              <section className="mt-4 rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_10px_24px_rgba(15,77,50,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[16px] font-semibold text-[var(--green-dark)]">Đơn hàng gần đây</h3>
                  <span className="text-xs text-[var(--muted)]">{orders.length} đơn</span>
                </div>
                {ordersLoading ? (
                  <div className="mt-4 h-16 animate-pulse rounded-[16px] bg-[rgba(15,77,50,0.06)]" />
                ) : orders.length ? (
                  <div className="mt-3 divide-y divide-[rgba(15,77,50,0.08)]">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.order_number} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <Link href={`/ca-nhan/don-hang/${order.id}`} className="text-sm font-semibold text-[var(--green-dark)] underline-offset-2 hover:underline">{order.order_number}</Link>
                          <div className="mt-1 truncate text-xs text-[var(--muted)]">{order.order_items?.[0]?.product_name ?? "Đơn hàng Hòa Phúc"}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-semibold text-[var(--green)]">{formatCurrency(order.total_vnd)}</div>
                          <div className="mt-1 text-xs text-[var(--muted)]">{orderStatusLabels[order.status] ?? order.status}</div>
                          {order.status === "pending" || order.status === "confirmed" ? <button type="button" className="mt-2 text-xs font-semibold text-[#a63d3d] underline underline-offset-2 disabled:opacity-50" disabled={cancellingOrder === order.id} onClick={() => void cancelOrder(order)}>{cancellingOrder === order.id ? "Đang hủy..." : "Hủy đơn"}</button> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm Hòa Phúc.</p>
                )}
              </section>
            ) : null}
          </section> : (
            <section className="mt-4 overflow-hidden rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_10px_24px_rgba(15,77,50,0.06)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Dành cho bạn</div>
              <h2 className="mt-2 text-[24px] font-semibold leading-tight text-[var(--green-dark)]">Đăng nhập để quản lý đơn hàng</h2>
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">Theo dõi trạng thái giao hàng, nhận điểm khi mua sắm và đổi voucher dành riêng cho hội viên.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/dang-nhap?redirect=/ca-nhan" className="flex h-11 items-center justify-center rounded-[14px] bg-[var(--green)] text-[14px] font-semibold text-white">Đăng nhập</Link>
                <Link href="/dang-ky-thanh-vien" className="flex h-11 items-center justify-center rounded-[14px] border border-[rgba(15,77,50,0.16)] text-[14px] font-semibold text-[var(--green-dark)]">Đăng ký</Link>
              </div>
              <Link href="/san-pham" className="mt-3 flex h-10 items-center justify-center text-[13px] font-semibold text-[var(--green)]">Tiếp tục xem sản phẩm <span className="ml-1 text-lg">›</span></Link>
            </section>
          )}

          <section className="mt-4 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_24px_rgba(15,77,50,0.08)]">
            <div className="px-4 py-3 text-[13px] leading-6 text-[var(--green-dark)]">
              Liên hệ nhanh để nhận tư vấn, demo và hỗ trợ triển khai giải pháp cho doanh nghiệp.
              <br />
              Cần hỗ trợ đơn hàng, đổi trả hoặc tư vấn chọn trà? Hòa Phúc luôn sẵn sàng đồng hành cùng bạn.
            </div>
            <div className="px-4 pb-4">
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center justify-center rounded-[14px] bg-[var(--green)] text-[14px] font-semibold text-white"
              >
                <span className="flex items-center gap-2"><Headset size={18} weight="bold" /> Liên hệ hỗ trợ</span>
              </a>
            </div>
          </section>

          {isLoggedIn ? <section className="mt-4 px-1">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Tiện ích</div>
                <h2 className="mt-2 text-[28px] font-semibold leading-[1.05] text-[var(--green-dark)]">Tiện ích của tôi</h2>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {utilities.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white px-3 py-4 text-center shadow-[0_12px_28px_rgba(15,77,50,0.08)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(15,77,50,0.06)] text-[24px] text-[var(--green)]">
                    {(() => { const Icon = item.icon; return <Icon size={24} weight="duotone" />; })()}
                  </div>
                  <div className="mt-3 text-[12px] leading-5 text-[var(--green-dark)]">
                    {item.label.split(" ").map((word, index) => (
                      <span key={`${word}-${index}`} className="block">
                        {word}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section> : null}

          {isLoggedIn ? <section className="mt-4 grid gap-3">
            {specialOffers.map((offer) => (
              <article key={offer.title} className="relative overflow-hidden rounded-[20px] border border-[rgba(15,77,50,0.08)] bg-white px-3.5 py-3 shadow-[0_8px_24px_rgba(15,77,50,0.06)]">
                <span className="absolute right-0 top-0 rounded-bl-[16px] bg-[var(--green)] px-3 py-1.5 text-[11px] font-semibold leading-none text-white">
                  Số lượng có hạn
                </span>
                <div className="flex items-center gap-3 pr-20">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${offer.icon === "%" ? "bg-[linear-gradient(180deg,#ff3a2d,#ff6a4b)]" : "bg-[linear-gradient(180deg,#c7efc7,#9fe4ba)]"} text-[24px] text-white`}>
                    {offer.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--green-dark)]">{offer.title}</h3>
                    <p className="mt-1 text-[12px] leading-6 text-[var(--muted)]">{offer.description}</p>
                    <p className="mt-0.5 text-[12px] leading-6 text-[var(--green-dark)]">{offer.expiry}</p>
                  </div>
                  <Link href="/gio-hang" className="flex h-11 w-16 shrink-0 items-center justify-center rounded-[10px] border border-[#a5c614] text-[13px] font-semibold leading-tight text-[#7ea700]">
                    Dùng
                    <br />
                    ngay
                  </Link>
                </div>
              </article>
            ))}
          </section> : null}

          <section className="mt-4 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_24px_rgba(15,77,50,0.08)]">
            <div className="px-4 py-3">
              <h2 className="text-[20px] font-semibold text-[var(--green-dark)]">Khác</h2>
            </div>
            <div className="space-y-0 divide-y divide-[rgba(15,77,50,0.08)]">
              <Link href="/lien-he" className="flex items-center justify-between px-4 py-3.5 text-[13px] text-[var(--green-dark)]">
                <span className="flex items-center gap-3">
                  <span className="text-[20px]">💬</span>
                  <span>Liên hệ và hỗ trợ</span>
                </span>
                <span className="text-[20px] leading-none text-[var(--muted)]">›</span>
              </Link>
            </div>
          </section>
        </div>
      </section>

      <div className="container">
        <LoyaltyDashboard userId={authUser?.id} />
      </div>

      <section className="hidden md:block section pt-10 md:pt-14">
        <div className="container max-w-4xl">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Cá nhân
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Tài khoản của bạn</h1>
          <div className="mt-8 grid gap-6">
            <section className="card rounded-[32px] p-8">
              <h2 className="text-3xl font-semibold text-[var(--green-dark)]">Hội viên</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Tích điểm, đổi quà và theo dõi ưu đãi dành riêng cho khách hàng Hòa Phúc.</p>
              <div className="mt-6 grid grid-cols-4 gap-4">
                {orderStates.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-[rgba(15,77,50,0.08)] bg-white p-4 text-center">
                    <div className="flex justify-center text-[var(--green)]"><item.icon size={28} weight="duotone" /></div>
                    <div className="mt-3 text-sm font-semibold text-[var(--green-dark)]">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="card rounded-[32px] p-8">
              <h2 className="text-3xl font-semibold text-[var(--green-dark)]">Tiện ích của tôi</h2>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {utilities.map((item) => (
                  <Link key={item.label} href={item.href} className="rounded-[24px] border border-[rgba(15,77,50,0.08)] bg-white p-4 text-center">
                    <div className="flex justify-center text-[var(--green)]"><item.icon size={28} weight="duotone" /></div>
                    <div className="mt-3 text-sm font-semibold text-[var(--green-dark)]">{item.label}</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
