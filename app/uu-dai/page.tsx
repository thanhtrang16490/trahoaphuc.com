 "use client";

import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { addProductToCart } from "@/components/cart-store";
import { useToast } from "@/components/toast";
import { canRedeem, readLoyaltyPoints, redeemLoyaltyReward, subscribeLoyalty } from "@/components/loyalty-store";
import { products } from "@/data/products";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { useMobileScrollVisibility } from "@/components/use-mobile-scroll-visibility";
import { useEffect, useState } from "react";

function IconShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>;
}

function LinePercentIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <circle cx="7" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.7 15.3 15.3 8.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </IconShell>
  );
}

function LineTruckIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M3.5 7.5h10v7h-10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M13.5 10h3.2l2.3 2.4v2.1h-5.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="8" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </IconShell>
  );
}

function LineTicketIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M4 7.5h16v3a1.5 1.5 0 0 0 0 3v3H4a1.5 1.5 0 0 0 0-3v-3a1.5 1.5 0 0 0 0-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 7.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1.3 2" />
      </svg>
    </IconShell>
  );
}

function LineClockIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8.5v4l2.7 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconShell>
  );
}

function LineTrophyIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M8 4.5h8v2.2a4 4 0 0 1-8 0z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 6.7H5.8A2.3 2.3 0 0 0 8.1 9h.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 6.7h2.2A2.3 2.3 0 0 1 15.9 9h-.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 10.5v3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9.4 17.5h5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10.5 14h3v3.5h-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </IconShell>
  );
}

function LineGiftIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M4.5 10h15v8.5h-15z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10v8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4.5 13.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 10c-1.6 0-2.9-1.2-2.9-2.8S10.4 4.5 12 4.5c1.6 0 2.9 1.2 2.9 2.7S13.6 10 12 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10c1.6 0 2.9-1.2 2.9-2.8S13.6 4.5 12 4.5c-1.6 0-2.9 1.2-2.9 2.7S10.4 10 12 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </IconShell>
  );
}

function LineDollarIcon({ className = "" }: { className?: string }) {
  return (
    <IconShell className={className}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M12 4.5v15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15.5 8.2c0-1.7-1.6-2.9-3.5-2.9s-3.5 1-3.5 2.5c0 1.2.8 2 2.5 2.5l2 .5c2 .5 3.5 1.5 3.5 3.3 0 1.8-1.6 3.2-4 3.2-2 0-3.9-.8-4.6-2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconShell>
  );
}

const specialOffers = [
  {
    title: "Giảm 5% cho đơn đầu tiên",
    description: "Áp dụng cho lần đầu mua hàng trên Mini App",
    badge: "Số lượng có hạn",
    expiry: "HSD: 01-09-2026",
    cta: "Dùng ngay",
    icon: "percent",
    productSlug: "tra-duong-tam-an-nhien",
  },
  {
    title: "Miễn phí vận chuyển",
    description: "Áp dụng cho đơn hàng từ 200k",
    badge: "Số lượng có hạn",
    expiry: "HSD: 01-09-2026",
    cta: "Dùng ngay",
    icon: "delivery",
    productSlug: "tra-thanh-nhiet-hoa-phuc",
  },
];

const pointRewards = [
  {
    id: "monthly-gift",
    title: "Ưu đãi đặc biệt trong tháng",
    description: "Ưu đãi siêu quà tặng nhân dịp 20-11",
    points: 3000,
    pointsLabel: "3000 điểm",
    status: "Chưa đủ điểm",
    color: "from-[#0f8aa6] to-[#48d3b6]",
    type: "gift" as const,
  },
  {
    id: "special-voucher",
    title: "Ưu đãi đặc biệt",
    description: "1 món quà cho đơn hàng phù hợp",
    points: 1100,
    pointsLabel: "1100 điểm",
    status: "Chưa đủ điểm",
    color: "from-[#7bbd28] to-[#d8f26c]",
    type: "voucher" as const,
  },
];

const featuredVoucher = products[0];
const pointRewardDots = pointRewards.length;

export default function UuDaiPage() {
  const featuredPrice = getProductPrice(featuredVoucher.slug);
  const { hidden } = useMobileScrollVisibility();
  const { showToast } = useToast();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const syncPoints = () => setPoints(readLoyaltyPoints());
    syncPoints();
    return subscribeLoyalty(syncPoints);
  }, []);

  const addOfferToCart = (slug: string, title: string) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    addProductToCart(product);
    showToast({
      title: "Đã thêm ưu đãi vào giỏ hàng",
      message: `${title} · ${product.name}`,
    });
  };

  const redeemReward = (reward: (typeof pointRewards)[number]) => {
    const redeemed = redeemLoyaltyReward({
      title: reward.title,
      type: reward.type,
      pointsCost: reward.points,
    });

    if (!redeemed) {
      showToast({
        title: "Chưa đủ điểm",
        message: `Bạn cần ${reward.points} điểm để đổi ${reward.title}.`,
      });
      return;
    }

    setPoints(readLoyaltyPoints());
    showToast({
      title: "Đổi thưởng thành công",
      message: `${reward.title} đã được lưu vào lịch sử đổi thưởng.`,
    });
  };

  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Ưu đãi", href: "/uu-dai" }]} />

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
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Ưu đãi</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">Giảm giá & ưu đãi</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container pt-6">
          <div className="px-1">
            <h1 className="text-[26px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--green-dark)]">
              Đặt hàng để tận hưởng ưu đãi
            </h1>
            <p className="mt-1 text-[13px] leading-6 text-[var(--muted)]">
              (*) Quà tặng có thể thêm vào giỏ hàng hoặc đổi bằng điểm thưởng ngay trên trang này.
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {specialOffers.map((offer, index) => (
              <article
                key={offer.title}
                className="relative overflow-hidden rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white px-3.5 py-3.5 shadow-[0_12px_28px_rgba(15,77,50,0.08)] transition-transform duration-200 active:scale-[0.99]"
              >
                <button
                  type="button"
                  className="absolute inset-0 z-10 rounded-[22px]"
                  aria-label={`Thêm ${offer.title} vào giỏ hàng`}
                  onClick={() => addOfferToCart(offer.productSlug, offer.title)}
                />
                <span className="absolute right-0 top-0 rounded-bl-[16px] bg-[var(--green)] px-3.5 py-1.5 text-[11px] font-semibold leading-none text-white shadow-[0_10px_18px_rgba(15,77,50,0.12)]">
                  {offer.badge}
                </span>
                <div className="pointer-events-none flex items-center gap-3 pr-20">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${index === 0 ? "from-[#ff3d2e] to-[#ff6347]" : "from-[#b7f0c6] to-[#9be4bc]"}`}>
                    {index === 0 ? <LinePercentIcon className="h-7 w-7 text-white" /> : <LineTruckIcon className="h-6.5 w-6.5 text-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[18px] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--green-dark)]">
                      {offer.title}
                    </h2>
                    <p className="mt-1 text-[12px] leading-6 text-[var(--muted)]">{offer.description}</p>
                    <p className="mt-0.5 text-[12px] leading-6 text-[var(--green-dark)]">{offer.expiry}</p>
                  </div>
                  <button
                    type="button"
                    className="pointer-events-auto flex h-18 w-18 items-center justify-center rounded-[8px] border border-[#a5c614] text-[13px] font-medium leading-tight text-[#7ea700]"
                    onClick={() => addOfferToCart(offer.productSlug, offer.title)}
                  >
                    {offer.cta}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 border-t border-[rgba(15,77,50,0.08)] pt-5">
              <div className="flex items-start gap-3">
                <LineTicketIcon className="mt-1 h-5 w-5 text-[#ff5f58]" />
                <div>
                  <h2 className="text-[22px] font-semibold leading-none tracking-[-0.03em] text-[var(--green-dark)]">Voucher</h2>
                <p className="mt-1.5 text-[13px] leading-6 text-[var(--muted)]">
                  Bạn đang có <span className="font-semibold text-[#ff4d4d]">1 voucher</span>
                </p>
              </div>
            </div>

            <article className="mt-4 overflow-hidden rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white shadow-[0_12px_28px_rgba(15,77,50,0.08)]">
              <div className="flex min-h-[150px]">
                <div className="flex w-[118px] shrink-0 flex-col items-center justify-center gap-2 bg-[#ff3c0e] px-3 text-center text-white">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                    <Image
                      src="/brand/hoaphuc-logo.svg"
                      alt={featuredVoucher.name}
                      width={96}
                      height={96}
                      className="h-16 w-16 rounded-full object-contain p-2"
                    />
                  </div>
                  <div className="text-[12px] leading-none">Hòa Phúc</div>
                </div>
                <div className="relative flex-1 px-3.5 py-3.5">
                  <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#ff8b00] px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                    <LineClockIcon className="h-3 w-3" />
                    Số lượng có hạn
                  </span>
                  <span className="absolute right-3.5 top-3 rounded-[4px] bg-[#ff4764] px-2 py-1 text-[11px] font-semibold leading-none text-white">
                    Mới!
                  </span>
                  <div className="mt-3 text-[18px] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--green-dark)]">
                    Giảm 10% cho đơn từ 1 triệu
                  </div>
                  <div className="mt-1.5 text-[12px] leading-6 text-[var(--muted)]">Áp dụng cho đơn hàng từ 1 triệu</div>
                  <div className="mt-2 inline-flex rounded-[6px] border border-[#f6c5ca] bg-[#fff5f5] px-2.5 py-1 text-[12px] font-medium text-[#d94c63]">
                    Khuyến mãi
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-3 text-[12px] text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px]">◷</span>
                      <span>Ngày hết hạn: 442 ngày</span>
                    </div>
                    <Link href={`/san-pham/${featuredVoucher.slug}`} className="font-semibold text-[#2d77c7] underline decoration-[#2d77c7]/30 underline-offset-4">
                      Điều kiện
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-[14px] border-2 border-[#ff5a46] px-3.5 py-2.5 text-[14px] font-semibold leading-tight text-[#ff5a46]"
                    onClick={() => addOfferToCart(featuredVoucher.slug, "Voucher đặc biệt")}
                  >
                    Thu
                    <br />
                    thập
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-7 border-t border-[rgba(15,77,50,0.08)] pt-5">
            <div className="flex items-start gap-3">
              <LineTrophyIcon className="mt-1 h-5 w-5 text-[#e39d09]" />
              <div>
                <h2 className="text-[22px] font-semibold leading-none tracking-[-0.03em] text-[var(--green-dark)]">Đổi Điểm Lấy Quà</h2>
                <p className="mt-1.5 text-[13px] leading-6 text-[var(--muted)]">
                  Bạn có <span className="font-semibold text-[#9ec200]">{points} điểm</span>{" "}
                  <span className="text-[18px] text-[var(--muted)]">(1 điểm = 1 đồng)</span>
                </p>
              </div>
            </div>

            <div
              className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [overscroll-behavior-x:contain] [scroll-behavior:smooth] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {pointRewards.map((reward) => (
                <article key={reward.id} className="min-w-[84%] max-w-[84%] snap-start overflow-hidden rounded-[22px] bg-white shadow-[0_10px_24px_rgba(15,77,50,0.08)] first:ml-1">
                  <div className={`relative aspect-[16/10] bg-gradient-to-br ${reward.color}`}>
                    <div className="absolute left-3 top-3 rounded-full bg-[#ff8b00] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                      <span className="inline-flex items-center gap-1">
                        <LinePercentIcon className="h-2.5 w-2.5" />
                        Hot
                      </span>
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-[#ff4b5e] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                      Mới!
                    </div>
                    <div className="absolute left-4 bottom-3 rounded-full bg-[#ffcc2f] px-3 py-1 text-[13px] font-semibold text-[#7a4d00] shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                      <span className="inline-flex items-center gap-1">
                        <LineDollarIcon className="h-3.5 w-3.5" />
                        {reward.pointsLabel}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[18px] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--green-dark)]">{reward.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-6 text-[var(--muted)]">{reward.description}</p>
                    <div className="mt-2.5 flex items-center gap-2 text-[12px] text-[var(--muted)]">
                      <span>☆</span>
                      <span>Còn 100 suất</span>
                    </div>
                    <button
                      type="button"
                      className={`mt-3.5 flex h-11 w-full items-center justify-center rounded-[14px] text-[14px] font-semibold ${
                        canRedeem(reward.points)
                          ? "bg-[linear-gradient(180deg,#0f4d32,#063b27)] text-white"
                          : "bg-[#e5e5ec] text-[#8b8b95]"
                      }`}
                      onClick={() => redeemReward(reward)}
                    >
                      <span className="inline-flex items-center gap-1">
                        <LineGiftIcon className="h-3.5 w-3.5" />
                        {canRedeem(reward.points) ? "Đổi ngay" : "Chưa đủ điểm"}
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: pointRewardDots }).map((_, index) => (
                <span
                  key={`point-dot-${index}`}
                  className={`h-2 rounded-full transition-all duration-300 ${index === 0 ? "w-7 bg-[var(--green)]" : "w-2 bg-[rgba(15,77,50,0.22)]"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hidden md:block section pt-10 md:pt-14">
        <div className="container">
          <div className="max-w-3xl">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Ưu đãi
            </div>
            <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Giảm giá & ưu đãi</h1>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
              Trang khuyến mãi dành riêng cho mobile mini app, trong khi desktop vẫn giữ bố cục gọn để SEO và tham khảo nội dung.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {specialOffers.map((offer) => (
              <article key={offer.title} className="card rounded-[24px] p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green)]">{offer.badge}</div>
                <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[var(--green-dark)]">{offer.title}</h2>
                <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{offer.description}</p>
                <div className="mt-3 text-xs font-semibold text-[var(--green-dark)]">{offer.expiry}</div>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="card rounded-[24px] p-5">
              <div className="flex items-center gap-3">
                <LineTicketIcon className="h-5 w-5 text-[#ff5f58]" />
                <h2 className="text-[22px] font-semibold text-[var(--green-dark)]">Voucher</h2>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">Bạn đang có 1 voucher</p>
              <div className="mt-4 rounded-[20px] border border-[rgba(15,77,50,0.08)] bg-white p-4">
                <div className="text-[18px] font-semibold text-[var(--green-dark)]">Giảm 10% cho đơn từ 1 triệu</div>
                <div className="mt-1.5 text-[13px] text-[var(--muted)]">Áp dụng cho đơn hàng từ 1 triệu</div>
                <div className="mt-2 text-[13px] font-semibold text-[#d94c63]">Khuyến mãi</div>
              </div>
            </article>
            <article className="card rounded-[24px] p-5">
              <div className="flex items-center gap-3">
                <LineTrophyIcon className="h-5 w-5 text-[#e39d09]" />
                <h2 className="text-[22px] font-semibold text-[var(--green-dark)]">Đổi Điểm Lấy Quà</h2>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                Bạn có <span className="font-semibold text-[var(--green-dark)]">{points} điểm</span> để đổi quà hoặc voucher.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
