"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BreadcrumbJsonLd } from "@/components/seo";
import type { AuthUser } from "@/components/auth-store";
import { clearAuthUser, isMockAdminUser, readAuthUser, subscribeAuth } from "@/components/auth-store";
import { brand } from "@/data/site";
import { useMobileScrollVisibility } from "@/components/use-mobile-scroll-visibility";

const orderStates = [
  { label: "Đơn hàng mới", icon: "NEW" },
  { label: "Chờ xác nhận", icon: "◷" },
  { label: "Đang giao hàng", icon: "🚚" },
  { label: "Đánh giá", icon: "★" },
];

const utilities = [
  { label: "Hội viên thân thiết", href: "/dang-ky-thanh-vien", icon: "⭐" },
  { label: "Lịch sử đơn hàng", href: "/gio-hang", icon: "🛒" },
  { label: "Đăng ký đại lý", href: "/dang-ky-dai-ly", icon: "🏪" },
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

export default function ProfilePage() {
  const { hidden } = useMobileScrollVisibility();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncAuth = () => setAuthUser(readAuthUser());
    syncAuth();
    return subscribeAuth(syncAuth);
  }, []);

  const isLoggedIn = Boolean(authUser);
  const points = isLoggedIn ? (isMockAdminUser(authUser) ? 1280 : 320) : 0;
  const avatarLetter = (authUser?.name || "H").trim().charAt(0).toUpperCase();

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
                <span className="text-[18px] leading-none">‹</span>
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Cá nhân</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">Tài khoản của bạn</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container pt-5">
          <article className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#9ad400,#7cc100)] p-3 text-white shadow-[0_12px_24px_rgba(124,193,0,0.18)]">
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
                      <span className="text-[18px] font-semibold leading-none text-white">{points} điểm</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <span className="text-[16px] leading-none">✓</span>
                      <span>{isMockAdminUser(authUser) ? "Quyền quản trị mock đã sẵn sàng" : "Tài khoản khách hàng đang hoạt động"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[13px] leading-6">
                      <span className="text-[16px] leading-none">✓</span>
                      <span>Đang đồng bộ lịch sử đơn và thông tin mua nhanh</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <span className="text-[16px] leading-none">✓</span>
                      <span>Đang đăng nhập bằng {authUser?.email}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 text-[13px] leading-6">
                      <span className="text-[16px] leading-none">✓</span>
                      <span>Tích luỹ điểm thưởng mỗi đơn hàng</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <span className="text-[16px] leading-none">✓</span>
                      <span>Đổi điểm lấy voucher & quà tặng</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5 text-[13px] leading-6">
                      <span className="text-[16px] leading-none">✓</span>
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

          <section className="mt-4 px-1">
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
                    {item.icon}
                  </div>
                  <div className="mt-3 text-[12px] leading-5 text-[var(--green-dark)]">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_24px_rgba(15,77,50,0.08)]">
            <div className="px-4 py-3 text-[13px] leading-6 text-[var(--green-dark)]">
              Liên hệ nhanh để nhận tư vấn, demo và hỗ trợ triển khai giải pháp cho doanh nghiệp.
              <br />
              Chúng tôi luôn sẵn sàng hỗ trợ bạn trong mọi giai đoạn mua hàng và vận hành.
            </div>
            <div className="px-4 pb-4">
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center justify-center rounded-[14px] bg-[var(--green)] text-[14px] font-semibold text-white"
              >
                Liên hệ hỗ trợ
              </a>
            </div>
          </section>

          <section className="mt-4 px-1">
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
                    {item.icon}
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
          </section>

          <section className="mt-4 grid gap-3">
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
                  <button className="flex h-18 w-18 items-center justify-center rounded-[6px] border border-[#a5c614] text-[13px] font-medium leading-tight text-[#7ea700]">
                    Dùng
                    <br />
                    ngay
                  </button>
                </div>
              </article>
            ))}
          </section>

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
                    <div className="text-3xl">{item.icon}</div>
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
                    <div className="text-3xl">{item.icon}</div>
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
