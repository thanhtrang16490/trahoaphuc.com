"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Leaf, Package, ShieldCheck, TreePalm } from "@phosphor-icons/react";
import { AddToCartButton } from "./add-to-cart-button";
import { MobileHomeSections } from "./mobile-home-sections";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import { blogPosts } from "@/data/blog";
import { homePageSections } from "@/data/home-page";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { brand } from "@/data/site";

export function HomePage({ products, categories }: { products: Product[]; categories: Category[] }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);
    if (motionQuery.matches) {
      return () => motionQuery.removeEventListener("change", syncMotionPreference);
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) {
      setShouldLoadHeroVideo(true);
      return () => motionQuery.removeEventListener("change", syncMotionPreference);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadHeroVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-full bg-[var(--green)] px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Bỏ qua đến nội dung chính
      </a>
      <main id="main-content" className="pb-[calc(env(safe-area-inset-bottom)+84px)] md:pb-0">
        <MobileHomeSections products={products} categories={categories} />

        <div className="hidden md:block">
          {homePageSections.hero ? (
            <section
              className="relative w-full overflow-hidden pt-0 md:pt-0"
              style={{ contentVisibility: "auto", containIntrinsicSize: "820px" }}
            >
              <div className="absolute inset-x-0 top-0 h-[90%] bg-[linear-gradient(180deg,#f5f0e1_0%,#eef7d7_48%,#e3efb0_100%)]" />
              <div className="relative mx-auto w-full max-w-[1600px] px-0">
                <div className="relative overflow-hidden border-y border-[rgba(15,77,50,0.1)] bg-[linear-gradient(135deg,#f7f4ea_0%,#eff6d5_42%,#ddecab_100%)] shadow-[0_24px_60px_rgba(15,77,50,0.12)] md:border-x">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(159,210,15,0.24)_0%,rgba(159,210,15,0.06)_55%,transparent_72%)] blur-2xl" />
                    <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(15,77,50,0.12)_0%,rgba(15,77,50,0.04)_48%,transparent_72%)] blur-2xl" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.5))]" />
                    <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
                      <span className="tea-mist absolute left-[8%] top-[16%] h-24 w-[34%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.34),rgba(255,255,255,0.12)_38%,transparent_74%)] blur-2xl" />
                      <span className="tea-mist tea-mist-delay-1 absolute right-[10%] top-[18%] h-28 w-[28%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.28),rgba(255,255,255,0.08)_40%,transparent_74%)] blur-3xl" />
                      <span className="tea-dust tea-dust-delay-1 absolute left-[-8%] top-[28%] h-[2px] w-8 rounded-full bg-[linear-gradient(90deg,transparent,rgba(136,168,92,0.18),rgba(136,168,92,0.35),transparent)]" />
                      <span className="tea-dust tea-dust-delay-2 absolute left-[-10%] top-[34%] h-[2px] w-10 rounded-full bg-[linear-gradient(90deg,transparent,rgba(136,168,92,0.14),rgba(136,168,92,0.3),transparent)]" />
                      <span className="tea-dust tea-dust-delay-3 absolute left-[-12%] top-[41%] h-[2px] w-12 rounded-full bg-[linear-gradient(90deg,transparent,rgba(136,168,92,0.16),rgba(136,168,92,0.28),transparent)]" />
                      <span className="tea-dust tea-dust-delay-4 absolute left-[-14%] top-[49%] h-[2px] w-9 rounded-full bg-[linear-gradient(90deg,transparent,rgba(136,168,92,0.14),rgba(136,168,92,0.26),transparent)]" />
                      <span className="tea-dust tea-dust-delay-5 absolute left-[-10%] top-[58%] h-[2px] w-11 rounded-full bg-[linear-gradient(90deg,transparent,rgba(136,168,92,0.12),rgba(136,168,92,0.24),transparent)]" />
                      <span className="tea-leaf tea-leaf-delay-1 absolute left-[13%] top-[22%] h-5 w-5 rotate-[-24deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(236,255,201,0.96),rgba(125,170,75,0.88)_70%,rgba(64,104,31,0.96)_100%)]" />
                      <span className="tea-leaf tea-leaf-delay-2 absolute left-[33%] top-[12%] h-4 w-4 rotate-[18deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(236,255,201,0.94),rgba(125,170,75,0.84)_70%,rgba(64,104,31,0.94)_100%)]" />
                      <span className="tea-leaf tea-leaf-delay-3 absolute right-[26%] top-[26%] h-5 w-5 rotate-[42deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(236,255,201,0.94),rgba(125,170,75,0.84)_70%,rgba(64,104,31,0.94)_100%)]" />
                      <span className="tea-leaf tea-leaf-delay-4 absolute right-[14%] top-[14%] h-4 w-4 rotate-[-36deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(236,255,201,0.92),rgba(125,170,75,0.82)_70%,rgba(64,104,31,0.92)_100%)]" />
                      <span className="tea-leaf tea-leaf-delay-5 absolute left-[48%] top-[30%] h-4.5 w-4.5 rotate-[62deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(236,255,201,0.93),rgba(125,170,75,0.83)_70%,rgba(64,104,31,0.93)_100%)]" />
                      <span className="tea-fall absolute left-[10%] top-[-12%] h-3 w-3 rotate-[-18deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(221,255,168,0.95),rgba(97,146,42,0.88)_68%,rgba(55,98,21,0.92)_100%)]" />
                      <span className="tea-fall tea-fall-delay-1 absolute left-[22%] top-[-16%] h-2.5 w-2.5 rotate-[32deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(221,255,168,0.9),rgba(97,146,42,0.82)_68%,rgba(55,98,21,0.9)_100%)]" />
                      <span className="tea-fall tea-fall-delay-2 absolute left-[37%] top-[-14%] h-3.5 w-3.5 rotate-[12deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(221,255,168,0.92),rgba(97,146,42,0.84)_68%,rgba(55,98,21,0.92)_100%)]" />
                      <span className="tea-fall tea-fall-delay-3 absolute left-[52%] top-[-18%] h-2.5 w-2.5 rotate-[54deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(221,255,168,0.88),rgba(97,146,42,0.8)_68%,rgba(55,98,21,0.9)_100%)]" />
                      <span className="tea-fall tea-fall-delay-4 absolute left-[68%] top-[-13%] h-3 w-3 rotate-[-44deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(221,255,168,0.92),rgba(97,146,42,0.84)_68%,rgba(55,98,21,0.92)_100%)]" />
                      <span className="tea-fall tea-fall-delay-5 absolute left-[82%] top-[-17%] h-2.5 w-2.5 rotate-[22deg] rounded-[999px_999px_999px_2px] bg-[radial-gradient(circle_at_30%_30%,rgba(221,255,168,0.88),rgba(97,146,42,0.82)_68%,rgba(55,98,21,0.9)_100%)]" />
                      <span className="tea-fall tea-fall-delay-6 absolute left-[14%] top-[2%] h-[2px] w-8 origin-center rotate-[18deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(97,146,42,0.32),transparent)]" />
                      <span className="tea-fall tea-fall-delay-7 absolute left-[44%] top-[4%] h-[2px] w-10 origin-center rotate-[-12deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(97,146,42,0.26),transparent)]" />
                      <span className="tea-fall tea-fall-delay-8 absolute left-[74%] top-[6%] h-[2px] w-8 origin-center rotate-[14deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(97,146,42,0.28),transparent)]" />
                    </div>
                    <div className="absolute left-5 top-6 hidden h-20 w-20 rounded-full border border-[rgba(15,77,50,0.14)] bg-[radial-gradient(circle,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.08)_45%,transparent_72%)] lg:block">
                      <div className="absolute inset-[18%] rounded-full border border-[rgba(15,77,50,0.16)]" />
                      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(15,77,50,0.18)]" />
                    </div>
                    <div className="absolute right-6 top-12 hidden h-28 w-28 rotate-12 rounded-[36px] border border-[rgba(15,77,50,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0.06))] lg:block">
                      <div className="absolute inset-x-4 top-4 h-px bg-[linear-gradient(90deg,transparent,rgba(15,77,50,0.35),transparent)]" />
                      <div className="absolute inset-x-6 top-8 h-px bg-[linear-gradient(90deg,transparent,rgba(15,77,50,0.22),transparent)]" />
                      <div className="absolute inset-x-8 top-12 h-px bg-[linear-gradient(90deg,transparent,rgba(15,77,50,0.18),transparent)]" />
                      <div className="absolute inset-x-10 top-16 h-px bg-[linear-gradient(90deg,transparent,rgba(15,77,50,0.16),transparent)]" />
                    </div>
                    <div className="absolute bottom-4 left-1/2 hidden w-[340px] -translate-x-1/2 lg:block">
                      <div className="h-12 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(159,210,15,0.18),transparent_68%)]" />
                      <div className="-mt-2 h-px bg-[linear-gradient(90deg,transparent,rgba(15,77,50,0.2),transparent)]" />
                    </div>
                  </div>

                  <div className="relative grid items-center gap-8 px-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:px-12 lg:py-10 xl:px-16">
                    <div className="order-2 lg:order-1">
                      <div className="eyebrow text-[11px] md:text-xs">
                        <span className="h-px w-8 bg-[var(--green)]" />
                        Quà tặng tinh hoa Cố đô
                      </div>

                      <h1 className="mt-5 max-w-[18ch] font-[family-name:Georgia] text-[clamp(3rem,4.9vw,5.2rem)] leading-[0.96] tracking-[-0.055em] text-pretty text-[var(--green-dark)]">
                        Món quà trà Việt, trao điều lành.
                      </h1>
                      <p className="mt-5 max-w-[48ch] section-copy text-[15px] md:text-[1.02rem] lg:text-[1.06rem]">
                        Trà thảo mộc và nông sản Việt từ Cúc Phương, Ninh Bình cho những món quà tinh tế.
                      </p>

                      <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
                        <a className="button button-primary px-5 py-3 text-sm md:px-6 md:py-4 md:text-base" href="#san-pham-noi-bat">
                          Khám phá sản phẩm <ArrowRight size={18} aria-hidden="true" />
                        </a>
                        <a className="button button-secondary px-5 py-3 text-sm md:px-6 md:py-4 md:text-base" href="/gioi-thieu">
                          Câu chuyện Hòa Phúc
                        </a>
                      </div>

                      <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        {[
                          { value: "30", label: "Túi lọc / hộp" },
                          { value: String(categories.length), label: "Nhóm sản phẩm" },
                          { value: "VN", label: "Nguồn gốc rõ" },
                          { value: "Zalo", label: "Tư vấn chọn quà" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-[24px] border border-[rgba(15,77,50,0.08)] bg-white/72 p-4 shadow-[0_10px_24px_rgba(15,77,50,0.06)] backdrop-blur-sm"
                          >
                            <div className="text-[22px] font-semibold leading-none tracking-[-0.04em] text-[var(--green-dark)] md:text-[26px]">
                              {item.value}
                            </div>
                            <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div ref={heroRef} className="order-1 lg:order-2">
                      <div className="relative mx-auto max-w-[720px]">
                        <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full bg-[rgba(15,77,50,0.08)] blur-2xl lg:block" />
                        <div className="absolute -right-4 bottom-8 hidden h-28 w-28 rounded-full bg-[rgba(159,210,15,0.18)] blur-2xl lg:block" />

                        <div className="overflow-hidden rounded-[34px] border border-[rgba(15,77,50,0.1)] bg-white/70 p-2 shadow-[0_24px_48px_rgba(15,77,50,0.14)] backdrop-blur-sm">
                          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#ede2cb,#d5b074)] aspect-[16/9]">
                            <Image
                              src="/media/video-tra-hoa-phuc-thumb.jpg"
                              alt="Khung hình giới thiệu trà Hòa Phúc"
                              width={1280}
                              height={720}
                              sizes="(min-width: 1280px) 44vw, 50vw"
                              className={`h-full w-full object-cover transition-opacity duration-500 ${
                                shouldLoadHeroVideo && !prefersReducedMotion ? "opacity-0" : "opacity-100"
                              }`}
                              priority
                            />
                            {shouldLoadHeroVideo && !prefersReducedMotion ? (
                              <video
                                className="absolute inset-0 h-full w-full object-cover"
                                poster="/media/video-tra-hoa-phuc-thumb.jpg"
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                                preload="metadata"
                                aria-label="Video giới thiệu thương hiệu Hòa Phúc"
                              >
                                <source src="/media/video-tra-hoa-phuc.webm" type="video/webm" />
                                <source src="/media/video-tra-hoa-phuc-optimized.mp4" type="video/mp4" />
                                <source src="/media/video-tra-hoa-phuc.mp4" type="video/mp4" />
                              </video>
                            ) : (
                              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(15,77,50,0),rgba(15,77,50,0.58))] px-4 py-4 text-white md:px-6 md:py-5">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                                  Video thương hiệu
                                </div>
                                <div className="mt-1 text-sm font-semibold md:text-base">
                                  Đang tải trải nghiệm video Hòa Phúc…
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="-mt-6 grid gap-3 px-4 md:grid-cols-3 md:px-8 lg:-mt-8">
                          {[
                            { title: "Vùng nguyên liệu", copy: "Chọn lọc theo miền đất và câu chuyện sản phẩm." },
                            { title: "Bao bì premium", copy: "Thiết kế kraft sang, phù hợp quà biếu." },
                            { title: "Mua dễ hơn", copy: "Đặt hàng nhanh, ưu đãi và điểm thưởng rõ ràng." },
                          ].map((item) => (
                            <div
                              key={item.title}
                              className="rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,77,50,0.08)]"
                            >
                              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">
                                {item.title}
                              </div>
                              <p className="mt-2 text-[12px] leading-6 text-[var(--muted)]">{item.copy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="border-b border-[rgba(15,77,50,0.1)] bg-white/45" aria-label="Lý do chọn Hòa Phúc">
            <div className="container grid gap-3 py-5 md:grid-cols-4 md:gap-5 md:py-7">
              {[
                { title: "Nguồn gốc Việt Nam", copy: "Từ Cúc Phương, Ninh Bình và các vùng nguyên liệu trong nước." },
                { title: "Đóng gói quà biếu", copy: "Bao bì kraft chỉn chu cho dịp tặng, tri ân và gặp gỡ." },
                { title: "Dùng được mỗi ngày", copy: "Hương vị dễ uống, phù hợp để chăm sóc những khoảng nghỉ nhỏ." },
                { title: "Tư vấn chọn quà", copy: "Nhắn Zalo hoặc gọi hotline để chọn sản phẩm phù hợp." },
              ].map((item) => (
                <div key={item.title} className="border-l border-[rgba(15,77,50,0.16)] pl-4 md:pl-5">
                  <h3 className="text-sm font-semibold text-[var(--green-dark)]">{item.title}</h3>
                  <p className="mt-1 text-xs leading-6 text-[var(--muted)]">{item.copy}</p>
                </div>
              ))}
            </div>
          </section>

        {homePageSections.brandStory ? (
          <section id="ve-hoa-phuc" className="section pt-4 md:pt-8" style={{ contentVisibility: "auto", containIntrinsicSize: "760px" }}>
            <div className="container grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
              <div className="panel overflow-hidden rounded-[28px] md:rounded-[32px]">
                <Image
                  src="/hero-hoaphuc.webp"
                  alt="Không gian giới thiệu Trà Bát Bảo Cúc Phương Hòa Phúc"
                  width={1448}
                  height={1086}
                  sizes="(min-width: 1024px) 43vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="mt-4 section-title text-[clamp(1.9rem,5vw,4.6rem)]">
                  Một thương hiệu nông sản Việt Nam mang tinh thần hiện đại.
                </h2>
                <p className="mt-4 section-copy text-[15px] md:text-[1.02rem]">
                  Nông Sản Hòa Phúc lựa chọn vùng nguyên liệu phù hợp để phát triển các sản phẩm trà thảo mộc, mật ong,
                  bột sắn dây và tinh bột nghệ mang đậm giá trị tự nhiên. Mỗi sản phẩm đều được kể bằng một ngôn ngữ bao
                  bì chỉn chu, dễ nhớ và phù hợp làm quà biếu cao cấp.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-4">
                  {[
                    { icon: Leaf, title: "Vùng nguyên liệu", copy: "Nguồn gốc Việt Nam, ưu tiên tính tự nhiên." },
                    { icon: ShieldCheck, title: "Chọn lọc chất lượng", copy: "Thiết kế quy trình và hình ảnh chỉn chu." },
                    { icon: TreePalm, title: "Cảm hứng thiên nhiên", copy: "Cúc Phương, Ninh Bình và vùng miền Việt Nam." },
                    { icon: Package, title: "Đóng gói đẹp", copy: "Bao bì kraft premium, thích hợp tặng biếu." },
                  ].map(({ icon: Icon, title, copy }) => (
                    <div key={title} className="card rounded-[24px] p-4 md:p-5">
                      <Icon size={22} weight="bold" color="var(--green)" aria-hidden="true" />
                      <h3 className="mt-3 text-base font-semibold text-[var(--green-dark)] md:mt-4 md:text-lg">{title}</h3>
                      <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {homePageSections.categoryRail ? (
          <section className="section py-6 md:py-24" style={{ contentVisibility: "auto", containIntrinsicSize: "560px" }}>
            <div className="container">
              <div className="max-w-3xl">
                <div className="eyebrow text-[11px] md:text-xs">
                  <span className="h-px w-8 bg-[var(--green)]" />
                  Danh mục sản phẩm
                </div>
                <h2 className="mt-4 section-title text-pretty text-[clamp(1.8rem,4.5vw,4.6rem)]">Phân nhóm rõ ràng, chọn quà dễ hơn.</h2>
                <p className="mt-4 max-w-[62ch] text-[15px] leading-7 text-[var(--muted)] md:text-base">
                  Tìm đúng loại trà theo nhu cầu sử dụng, dịp tặng và câu chuyện vùng miền bạn muốn trao gửi.
                </p>
              </div>
              <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-3">
                {categories.map((category, index) => (
                  <Link
                    key={category.slug}
                    href={`/muc-san-pham/${category.slug}`}
                    className="card group flex min-h-[236px] flex-col rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold tracking-[0.18em] text-[var(--brown)]">0{index + 1}</div>
                      <ArrowRight size={18} className="text-[var(--green)] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                    <h3 className="mt-10 text-xl font-semibold uppercase tracking-[0.06em] text-[var(--green-dark)] md:text-2xl">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{category.description}</p>
                    <span className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--green)]">Xem nhóm sản phẩm</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {homePageSections.featuredProducts ? (
          <section id="san-pham-noi-bat" className="section pt-6 md:pt-24" style={{ contentVisibility: "auto", containIntrinsicSize: "980px" }}>
            <div className="container">
              <div className="eyebrow text-[11px] md:text-xs">
                <span className="h-px w-8 bg-[var(--green)]" />
                Sản phẩm nổi bật
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <h2 className="section-title text-[clamp(1.8rem,4.5vw,4.6rem)]">Sản phẩm được yêu thích</h2>
                <Link href="/san-pham" className="button button-secondary px-4 py-3 text-sm md:px-5">
                  Xem toàn bộ <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
                {products.slice(0, 4).map((product) => (
                  <article key={product.slug} className="card flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] md:rounded-[32px]">
                    <Link href={`/san-pham/${product.slug}`} className="group block" aria-label={`Xem ${product.name}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={product.imageWidth}
                          height={product.imageHeight}
                          sizes="(max-width: 767px) 50vw, (max-width: 1280px) 25vw, 320px"
                          className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    </Link>
                    <div className="flex flex-1 min-w-0 flex-col p-5 md:p-6">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brown)] md:text-xs">
                        {product.category}
                      </div>
                      <Link href={`/san-pham/${product.slug}`} className="mt-3 block min-w-0">
                        <h3 className="line-clamp-2 min-h-[2.3em] text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--green-dark)] transition-colors hover:text-[var(--green)] md:text-2xl">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-3 line-clamp-2 min-h-[3.5rem] text-sm leading-7 text-[var(--muted)]">{product.shortDescription}</p>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[rgba(15,77,50,0.1)] pt-4">
                        <div className="min-w-0">
                          <div className="text-xl font-semibold tracking-[-0.04em] text-[var(--green-dark)]">{formatCurrency(product.price ?? getProductPrice(product.slug))}</div>
                          {product.originalPrice && product.originalPrice > (product.price ?? 0) ? <div className="text-xs text-[var(--muted)] line-through">{formatCurrency(product.originalPrice)}</div> : null}
                          <div className="mt-1 truncate text-xs text-[var(--muted)]">{product.packageLabel}</div>
                        </div>
                        <span className="shrink-0 rounded-full bg-[rgba(15,77,50,0.06)] px-3 py-1 text-xs font-semibold text-[var(--green)]">
                          {product.origin}
                        </span>
                      </div>
                      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                        <Link
                          href={`/san-pham/${product.slug}`}
                          className="button button-secondary min-w-0 justify-center whitespace-nowrap px-2 py-3 text-xs md:text-sm"
                        >
                          Chi tiết
                        </Link>
                        <div className="min-w-0">
                          <AddToCartButton slug={product.slug} product={product} className="md:w-full" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="section py-8 md:py-24" style={{ contentVisibility: "auto", containIntrinsicSize: "280px" }}>
          <div className="container">
            <div className="rounded-[34px] bg-[linear-gradient(135deg,#12331f,#2d6e2e_60%,#9fd20f)] p-6 text-white shadow-[0_20px_50px_rgba(15,77,50,0.2)] md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <h2 className="max-w-[15ch] text-pretty text-[clamp(2rem,4.5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
                    Mở rộng kinh doanh cùng Hòa Phúc.
                  </h2>
                  <p className="mt-4 max-w-[58ch] text-[15px] leading-8 text-white/84 md:text-base">
                    Đăng ký đại lý để nhận tư vấn chính sách, hỗ trợ hình ảnh bán hàng và danh mục sản phẩm phù hợp cho
                    khu vực của bạn.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Link href="/dang-ky-dai-ly" className="button button-primary justify-center !bg-white !text-[var(--green-dark)]">
                    Đăng ký đại lý
                  </Link>
                  <a
                    href={brand.zalo}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-secondary justify-center !border-white/30 !bg-white/10 !text-white hover:!bg-white/15"
                  >
                    Nhắn Zalo tư vấn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {homePageSections.brandProof ? (
          <section id="cau-chuyen" className="section pt-8 md:pt-24">
            <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,#dcebb8,#f6f1e7_52%,#d8b77b)] p-5 md:p-7">
                <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-white/35 blur-3xl" />
                <div className="absolute -bottom-16 -left-8 h-56 w-56 rounded-full bg-[rgba(15,77,50,0.12)] blur-3xl" />
                <div className="relative grid min-h-[360px] grid-cols-2 items-center gap-3 md:min-h-[456px] md:gap-5">
                  <div className="relative z-10 overflow-hidden rounded-[26px] border border-white/60 bg-white/65 p-2 shadow-[0_24px_50px_rgba(15,77,50,0.15)]">
                    <Image
                      src={products[3].boxImage}
                      alt="Hộp Trà Bát Bảo Cúc Phương Hòa Phúc"
                      width={products[3].boxImageWidth}
                      height={products[3].boxImageHeight}
                      className="aspect-[4/3] w-full rounded-[20px] bg-[#f4eee2] object-contain"
                    />
                  </div>
                  <div className="relative z-10 overflow-hidden rounded-[26px] border border-white/70 bg-white/75 p-2 shadow-[0_24px_50px_rgba(15,77,50,0.18)]">
                    <Image
                      src={products[1].boxImage}
                      alt="Hộp Trà Thanh Nhiệt Hòa Phúc"
                      width={products[1].boxImageWidth}
                      height={products[1].boxImageHeight}
                      className="aspect-[4/3] w-full rounded-[20px] bg-[#f4eee2] object-contain"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 rounded-full border border-white/70 bg-[var(--green-dark)] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(15,77,50,0.2)] md:bottom-6 md:left-6">
                    Từ Cúc Phương, Ninh Bình
                  </div>
                </div>
              </div>
              <div>
                <h2 className="section-title text-pretty text-[clamp(1.8rem,4.5vw,4.6rem)]">
                  Từ vùng nguyên liệu Việt đến món quà bạn muốn trao tặng.
                </h2>
                <p className="mt-4 section-copy text-[15px] md:text-[1.02rem]">
                  Hòa Phúc bắt đầu từ tình yêu với nông sản Việt và những khoảng nghỉ giản dị mỗi ngày. Mỗi dòng trà
                  được chọn lọc từ thảo mộc quen thuộc, phối trộn để có vị dễ uống, rồi kể lại bằng bao bì chỉn chu mang
                  dấu ấn Cố đô.
                </p>
                <div className="mt-7 grid gap-3 md:grid-cols-3 md:gap-4">
                  {[
                    { step: "01", title: "Chọn từ vùng đất lành", copy: "Ưu tiên thảo mộc và nông sản có câu chuyện rõ ràng." },
                    { step: "02", title: "Giữ vị dễ gần", copy: "Phối trộn cân bằng để bạn dễ thưởng thức mỗi ngày." },
                    { step: "03", title: "Trao một điều đẹp", copy: "Đóng gói chỉn chu cho những dịp cần sự tinh tế." },
                  ].map((item) => (
                    <div key={item.step} className="rounded-[22px] border border-[rgba(15,77,50,0.1)] bg-white/65 p-4">
                      <div className="text-xs font-semibold tracking-[0.18em] text-[var(--brown)]">{item.step}</div>
                      <h3 className="mt-3 text-sm font-semibold leading-5 text-[var(--green-dark)]">{item.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{item.copy}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/gioi-thieu/cau-chuyen-thuong-hieu" className="button button-primary px-5 py-3 text-sm">
                    Đọc câu chuyện <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                  <Link href="/san-pham" className="button button-secondary px-5 py-3 text-sm">
                    Chọn trà phù hợp
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {homePageSections.blogTeaser ? (
          <section className="section pt-4 md:pt-24">
            <div className="container">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="section-title text-pretty text-[clamp(1.8rem,4.5vw,4.6rem)]">
                    Kiến thức ngắn, dễ đọc, hỗ trợ mua hàng.
                  </h2>
                </div>
                <Link href="/tin-tuc" className="hidden button button-secondary md:inline-flex">
                  Xem blog
                </Link>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-3 md:gap-6">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/tin-tuc/${post.slug}`}
                    className="card overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-1 md:rounded-[32px]"
                  >
                    <Image src={post.coverImage} alt={post.title} width={1400} height={1050} className="h-auto w-full" />
                    <div className="p-5 md:p-6">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brown)]">
                        {post.category}
                      </div>
                      <h3 className="mt-3 text-[1.2rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--green-dark)]">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {homePageSections.story ? (
          <section className="section pt-4 md:pt-24">
            <div className="container">
              <div className="overflow-hidden rounded-[34px] bg-[var(--green-dark)] text-white shadow-[0_24px_60px_rgba(15,77,50,0.2)]">
                <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                  <div className="relative overflow-hidden p-6 md:p-10 lg:p-14">
                    <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(159,210,15,0.22)] blur-3xl" />
                    <div aria-hidden="true" className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
                    <div className="relative">
                      <div className="text-sm font-semibold text-white/70">Gợi ý chọn quà</div>
                      <h2 className="mt-4 max-w-[12ch] text-pretty text-[clamp(2.2rem,4.8vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                        Một hộp trà, nhiều dịp trao gửi.
                      </h2>
                      <p className="mt-5 max-w-[38ch] text-[15px] leading-8 text-white/78 md:text-base">
                        Từ món quà thăm hỏi đến lời tri ân đối tác, Hòa Phúc giúp bạn chọn một sản phẩm vừa đẹp vừa có câu chuyện.
                      </p>
                      <a
                        href={brand.zalo}
                        target="_blank"
                        rel="noreferrer"
                        className="button mt-7 !bg-white !text-[var(--green-dark)] hover:!bg-[#f3ead9]"
                      >
                        Tư vấn chọn quà <ArrowRight size={17} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-white/15 lg:border-l lg:border-t-0">
                    {[
                      {
                        number: "01",
                        title: "Biếu người thân",
                        copy: "Những dòng trà thanh lành, dễ trao trong các dịp thăm hỏi.",
                        href: "/muc-san-pham/tra-thao-moc",
                      },
                      {
                        number: "02",
                        title: "Tri ân đối tác",
                        copy: "Bao bì chỉn chu và hương vị Việt cho những cuộc gặp quan trọng.",
                        href: "/muc-san-pham/dac-san-vung-mien",
                      },
                      {
                        number: "03",
                        title: "Dùng mỗi ngày",
                        copy: "Lựa chọn gọn vị cho những khoảng nghỉ nhỏ trong nhịp sống hiện đại.",
                        href: "/muc-san-pham/duong-sinh",
                      },
                    ].map((item) => (
                      <Link
                        key={item.number}
                        href={item.href}
                        className="group flex items-start justify-between gap-6 border-b border-white/15 px-6 py-6 last:border-b-0 md:px-10 md:py-8"
                      >
                        <div className="flex min-w-0 gap-5">
                          <span className="pt-1 text-sm font-semibold tracking-[0.18em] text-[#cbe66b]">{item.number}</span>
                          <div>
                            <h3 className="text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">{item.title}</h3>
                            <p className="mt-2 max-w-[44ch] text-sm leading-7 text-white/68">{item.copy}</p>
                          </div>
                        </div>
                        <ArrowRight size={21} className="mt-1 shrink-0 text-white/55 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        </div>
      </main>
    </>
  );
}
