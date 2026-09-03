"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Medal, ShoppingBagOpen, Storefront } from "@phosphor-icons/react";
import { UserCircle } from "@phosphor-icons/react";
import { categories } from "@/data/categories";
import { blogPosts } from "@/data/blog";
import { homePageSections } from "@/data/home-page";
import { products } from "@/data/products";

const quickActions = [
  { label: ["Lịch sử", "Đơn hàng"], href: "/gio-hang", icon: ShoppingBagOpen },
  { label: ["Đại lý", "Hợp tác"], href: "/dang-ky-dai-ly", icon: Storefront },
  { label: ["Vòng quay", "May mắn"], href: "/vong-quay-may-man", icon: Gift },
  { label: ["Hội viên", "Thân thiết"], href: "/dang-ky-thanh-vien", icon: Medal },
];

const utilityItems = [
  { label: "Vòng quay may mắn", href: "/vong-quay-may-man" },
  { label: "Hội viên thân thiết", href: "/dang-ky-thanh-vien" },
  { label: "Lịch sử đơn hàng", href: "/gio-hang" },
  { label: "Lịch sử điểm thưởng", href: "/dang-nhap" },
];

export function MobileHomeSections() {
  const blogCarouselRef = useRef<HTMLDivElement | null>(null);
  const [activeBlogIndex, setActiveBlogIndex] = useState(0);
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  useEffect(() => {
    const container = blogCarouselRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-blog-card]"));
    if (cards.length === 0) return;

    const updateActiveIndex = () => {
      const containerLeft = container.scrollLeft;
      const cardWidth = cards[0]?.offsetWidth ?? container.clientWidth;
      const gap = 12;
      const step = cardWidth + gap;
      const index = Math.round(containerLeft / step);
      setActiveBlogIndex(Math.max(0, Math.min(cards.length - 1, index)));
    };

    updateActiveIndex();
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      container.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, []);

  return (
    <div className="md:hidden">
      {homePageSections.hero ? (
        <section className="pt-0">
          <div className="relative aspect-[16/9] w-screen overflow-hidden bg-[linear-gradient(180deg,#ecffe6,#d3f0b3)]">
            <Image
              src="/media/video-tra-hoa-phuc-thumb.jpg"
              alt="Khung hình giới thiệu trà Hòa Phúc"
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-300 ${heroVideoReady ? "opacity-0" : "opacity-100"}`}
              priority
            />
            <video
              className="absolute inset-0 h-full w-full object-cover"
              poster="/media/video-tra-hoa-phuc-thumb.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-label="Hero video trà Hòa Phúc"
              onCanPlay={() => setHeroVideoReady(true)}
            >
              <source src="/media/video-tra-hoa-phuc.webm" type="video/webm" />
              <source src="/media/video-tra-hoa-phuc-optimized.mp4" type="video/mp4" />
              <source src="/media/video-tra-hoa-phuc.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(124,180,0,0.18),rgba(9,45,27,0.46))]" />
          </div>
        </section>
      ) : null}

      <section className="px-4 pt-3">
        <div
          className="rounded-[28px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_14px_34px_rgba(15,77,50,0.08)]"
          style={{ contentVisibility: "auto", containIntrinsicSize: "420px" }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(15,77,50,0.08)] text-[var(--green)]">
                <UserCircle size={34} weight="fill" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-[var(--muted)]">Xin chào,</div>
                <div className="text-[18px] font-semibold leading-tight text-[var(--green-dark)]">Quý khách hàng</div>
              </div>
            </div>
            <div className="border-l border-[rgba(15,77,50,0.12)] pl-4 text-right">
              <div className="text-[12px] text-[var(--muted)]">Điểm thưởng: 0đ</div>
              <div className="mt-1 text-[16px] font-semibold text-[var(--green-dark)]">Chưa là hội viên</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((item) => (
                (() => {
                  const Icon = item.icon;

                  return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[84px] items-center gap-3 rounded-[20px] border border-[rgba(15,77,50,0.1)] bg-[linear-gradient(180deg,#ffffff,#fbfaf6)] px-4 py-3 shadow-[0_10px_20px_rgba(15,77,50,0.06)]"
              >
                <span className="min-w-0 flex-1 text-[14px] leading-[1.02] text-[var(--green-dark)]">
                  {Array.isArray(item.label)
                    ? item.label.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))
                    : item.label}
                </span>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[rgba(15,77,50,0.06)] text-[var(--green)]">
                  <Icon size={22} weight="bold" />
                </span>
              </Link>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div
          className="rounded-[24px] bg-[linear-gradient(90deg,#dbf46f,#e8f8c0)] p-4 shadow-[0_12px_28px_rgba(92,160,0,0.12)]"
          style={{ contentVisibility: "auto", containIntrinsicSize: "120px" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Ưu đãi</div>
              <div className="mt-1 text-[18px] font-semibold leading-tight text-[var(--green-dark)]">Bạn đang có 2 ưu đãi</div>
              <div className="mt-1 text-[13px] leading-6 text-[var(--muted)]">Mua hàng để tận hưởng ưu đãi ngay bạn nhé!</div>
            </div>
            <Link
              href="/ca-nhan"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--green)] shadow-[0_10px_20px_rgba(15,77,50,0.12)]"
              aria-label="Xem ưu đãi trong tài khoản"
            >
              <span className="text-2xl leading-none">›</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#163a23,#2f6f2f)] p-4 text-white shadow-[0_18px_40px_rgba(15,77,50,0.22)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">Đại lý</div>
              <h2 className="mt-2 text-[24px] font-semibold leading-[1.02]">Mở đại lý cùng Hòa Phúc</h2>
              <p className="mt-2 max-w-[34ch] text-[13px] leading-6 text-white/78">
                Chính sách linh hoạt, hình ảnh đồng bộ và hỗ trợ ra đơn cho kênh bán online lẫn offline.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white/12 text-white">
              <Storefront size={24} weight="bold" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/dang-ky-dai-ly"
              className="flex h-12 items-center justify-center rounded-[16px] bg-white text-[14px] font-semibold !text-[#0f4d32]"
            >
              Đăng ký ngay
            </Link>
            <a
              href="https://www.facebook.com/nongsanhoaphucnb/"
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center rounded-[16px] border border-white/20 bg-white/8 text-[14px] font-semibold text-white"
            >
              Nhắn fanpage
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div
          className="rounded-[28px] bg-white p-5 shadow-[0_14px_32px_rgba(15,77,50,0.08)]"
          style={{ contentVisibility: "auto", containIntrinsicSize: "320px" }}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Danh mục</div>
              <h2 className="mt-2 text-[26px] font-semibold leading-[1.05] text-[var(--green-dark)]">Danh mục sản phẩm</h2>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/muc-san-pham/${category.slug}`}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(15,77,50,0.06)] text-[24px] text-[var(--green)]">
                  {category.name.startsWith("Trà") ? "🍃" : category.name.startsWith("Dưỡng") ? "🌿" : "🎁"}
                </div>
                <span className="text-[12px] leading-5 text-[var(--green-dark)]">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {homePageSections.blogTeaser ? (
        <section className="pt-8">
          <div
            className="bg-white px-5 py-5 shadow-[0_14px_32px_rgba(15,77,50,0.08)]"
            style={{ contentVisibility: "auto", containIntrinsicSize: "460px" }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Tin tức</div>
            <h2 className="mt-2 text-[26px] font-semibold leading-[1.05] text-[var(--green-dark)]">Bài viết gần đây</h2>
            <div
              ref={blogCarouselRef}
              className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pl-8 pr-5 pb-2 [scrollbar-width:none] [overscroll-behavior-x:contain] [scroll-behavior:smooth] [scroll-padding-left:2rem] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/tin-tuc/${post.slug}`}
                  data-blog-card
                  className="min-w-[84%] max-w-[84%] snap-start overflow-hidden rounded-[22px] bg-white shadow-[0_10px_24px_rgba(15,77,50,0.08)] first:ml-1"
                >
                  <Image src={post.coverImage} alt={post.title} width={1400} height={1050} className="aspect-[16/10] w-full object-cover" />
                  <div className="px-5 py-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">{post.category}</div>
                    <div className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-[1.18] text-[var(--green-dark)]">{post.title}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {blogPosts.slice(0, 3).map((post, index) => (
                <span
                  key={post.slug}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeBlogIndex ? "w-7 bg-[var(--green)]" : "w-2 bg-[rgba(15,77,50,0.22)]"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {homePageSections.featuredProducts ? (
        <section id="san-pham-mobile" className="px-4 pt-6">
          <div className="flex items-end justify-between gap-4" style={{ contentVisibility: "auto", containIntrinsicSize: "90px" }}>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Sản phẩm</div>
              <h2 className="mt-2 text-[28px] font-semibold leading-[1.05] text-[var(--green-dark)]">Sản phẩm nổi bật</h2>
            </div>
            <Link href="/san-pham" className="text-sm font-semibold text-[var(--green)]">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.slug}
                href={`/san-pham/${product.slug}`}
                className="overflow-hidden rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white shadow-[0_12px_28px_rgba(15,77,50,0.08)]"
              >
                <Image src={product.image} alt={product.name} width={product.imageWidth} height={product.imageHeight} className="h-auto w-full" />
                <div className="p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brown)]">{product.category}</div>
                  <div className="mt-2 text-[14px] font-semibold leading-snug text-[var(--green-dark)]">{product.name}</div>
                  <div className="mt-2 line-clamp-2 text-[12px] leading-5 text-[var(--muted)]">{product.shortDescription}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
