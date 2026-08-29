"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Leaf, Package, ShieldCheck, TreePalm } from "@phosphor-icons/react";
import { Header } from "./header";
import { AddToCartButton } from "./add-to-cart-button";
import { MobileHomeSections } from "./mobile-home-sections";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { blogPosts } from "@/data/blog";
import { homePageSections } from "@/data/home-page";

export function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) {
      setShouldLoadHeroVideo(true);
      return;
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
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main className="pb-[calc(env(safe-area-inset-bottom)+84px)] md:pb-0">
        <MobileHomeSections />

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

                      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[var(--green-dark)] backdrop-blur">
                        <span className="text-[var(--green)]">✦</span>
                        Sang trọng, ý nghĩa, phù hợp biếu tặng và tri ân
                      </div>

                      <h1 className="mt-5 max-w-[11ch] font-[family-name:Georgia] text-[clamp(3.1rem,6.6vw,6.3rem)] leading-[0.9] tracking-[-0.065em] text-[var(--green-dark)]">
                        Tinh hoa Cố đô, món quà đẹp từ Hòa Phúc.
                      </h1>
                      <p className="mt-5 max-w-[62ch] section-copy text-[15px] md:text-[1.02rem] lg:text-[1.06rem]">
                        Hòa Phúc mang đến trà thảo mộc và nông sản Việt được tuyển chọn kỹ, đóng gói tinh tế để trở
                        thành món quà trang nhã, đậm hồn Cố đô, dễ trao tặng và dễ ghi nhớ.
                      </p>

                      <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
                        <a className="button button-primary px-5 py-3 text-sm md:px-6 md:py-4 md:text-base" href="#san-pham-noi-bat">
                          Chọn quà ngay <ArrowRight size={18} />
                        </a>
                        <a className="button button-secondary px-5 py-3 text-sm md:px-6 md:py-4 md:text-base" href="/gioi-thieu">
                          Khám phá tinh hoa Cố đô
                        </a>
                      </div>

                      <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
                        {[
                          { value: "100%", label: "Tự nhiên" },
                          { value: "4+", label: "Nhóm sản phẩm" },
                          { value: "01", label: "Một câu chuyện" },
                          { value: "365", label: "Dùng hằng ngày" },
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
                              width={products[0].imageWidth}
                              height={products[0].imageHeight}
                              className={`h-full w-full object-cover transition-opacity duration-500 ${
                                shouldLoadHeroVideo ? "opacity-0" : "opacity-100"
                              }`}
                              priority
                            />
                            {shouldLoadHeroVideo ? (
                              <video
                                className="absolute inset-0 h-full w-full object-cover"
                                poster="/media/video-tra-hoa-phuc-thumb.jpg"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="none"
                                aria-label="Video giới thiệu thương hiệu Hòa Phúc"
                                onCanPlay={() => setShouldLoadHeroVideo(true)}
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
                                  Đang tải trải nghiệm video Hòa Phúc...
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

        {homePageSections.brandStory ? (
          <section id="ve-hoa-phuc" className="section pt-4 md:pt-8" style={{ contentVisibility: "auto", containIntrinsicSize: "760px" }}>
            <div className="container grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
              <div className="panel overflow-hidden rounded-[28px] md:rounded-[32px]">
                <Image
                  src={products[0].image}
                  alt="Không gian sản phẩm trà Hòa Phúc"
                  width={products[0].imageWidth}
                  height={products[0].imageHeight}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="eyebrow text-[11px] md:text-xs">
                  <span className="h-px w-8 bg-[var(--green)]" />
                  Từ vùng đất lành
                </div>
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
                      <Icon size={22} weight="bold" color="var(--green)" />
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
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="eyebrow text-[11px] md:text-xs">
                    <span className="h-px w-8 bg-[var(--green)]" />
                    Danh mục sản phẩm
                  </div>
                  <h2 className="mt-4 section-title text-[clamp(1.8rem,4.5vw,4.6rem)]">Phân nhóm rõ ràng, trình bày cao cấp.</h2>
                </div>
                <p className="hidden max-w-[34ch] text-sm leading-7 text-[var(--muted)] lg:block">
                  Cấu trúc danh mục được tối ưu cho hành trình mua hàng, đồng thời tạo nền tảng tốt cho SEO theo từng cụm
                  sản phẩm.
                </p>
              </div>
              <div className="mt-6 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mt-8 md:grid md:gap-5 md:overflow-visible md:px-0 md:grid-cols-2 xl:grid-cols-4">
                {categories.map((category, index) => (
                  <Link
                    key={category.slug}
                    href={`/muc-san-pham/${category.slug}`}
                    className="card min-w-[210px] rounded-[26px] p-5 transition-transform duration-300 hover:-translate-y-1 md:min-w-0 md:rounded-[28px] md:p-6"
                  >
                    <div className="text-sm font-semibold tracking-[0.18em] text-[var(--brown)]">0{index + 1}</div>
                    <h3 className="mt-8 text-xl font-semibold uppercase tracking-[0.06em] text-[var(--green-dark)] md:mt-10 md:text-2xl">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="section pb-6 md:pb-24" style={{ contentVisibility: "auto", containIntrinsicSize: "280px" }}>
          <div className="container">
            <div className="rounded-[34px] bg-[linear-gradient(135deg,#12331f,#2d6e2e_60%,#9fd20f)] p-6 text-white shadow-[0_20px_50px_rgba(15,77,50,0.2)] md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <div className="eyebrow text-[11px] md:text-xs">
                    <span className="h-px w-8 bg-white/70" />
                    Đại lý phân phối
                  </div>
                  <h2 className="mt-4 text-[clamp(2rem,4.5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
                    Mở rộng kinh doanh cùng Hòa Phúc.
                  </h2>
                  <p className="mt-4 max-w-[58ch] text-[15px] leading-8 text-white/84 md:text-base">
                    Đăng ký đại lý để nhận tư vấn chính sách, hỗ trợ hình ảnh bán hàng và danh mục sản phẩm phù hợp cho
                    khu vực của bạn.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Link href="/dang-ky-dai-ly" className="button button-primary justify-center bg-white text-[var(--green-dark)]">
                    Đăng ký đại lý
                  </Link>
                  <a
                    href="https://www.facebook.com/nongsanhoaphucnb/"
                    target="_blank"
                    rel="noreferrer"
                    className="button button-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/15"
                  >
                    Nhắn tin fanpage
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {homePageSections.featuredProducts ? (
          <section id="san-pham-noi-bat" className="section pt-6 md:pt-24" style={{ contentVisibility: "auto", containIntrinsicSize: "980px" }}>
            <div className="container">
              <div className="eyebrow text-[11px] md:text-xs">
                <span className="h-px w-8 bg-[var(--green)]" />
                Sản phẩm nổi bật
              </div>
              <h2 className="mt-4 section-title text-[clamp(1.8rem,4.5vw,4.6rem)]">Sản phẩm được yêu thích</h2>
              <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
                {products.map((product) => (
                  <article key={product.slug} className="card relative overflow-hidden rounded-[28px] md:rounded-[32px]">
                    <Link href={`/san-pham/${product.slug}`} className="absolute inset-0 z-0" aria-label={product.name} />
                    <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
                      <div className="relative z-10">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={product.imageWidth}
                          height={product.imageHeight}
                          className="h-auto w-full"
                        />
                      </div>
                      <div className="relative z-10 p-5 md:p-7 lg:p-8">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brown)] md:text-sm">
                              {product.category}
                            </div>
                            <h3 className="mt-3 text-[1.45rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--green-dark)] md:mt-4 md:text-3xl">
                              {product.name}
                            </h3>
                          </div>
                          <div className="rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 px-3 py-1 text-[11px] font-semibold text-[var(--green-dark)] md:px-4 md:py-1.5 md:text-xs">
                            {product.packageLabel}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--muted)] md:mt-4">{product.shortDescription}</p>
                        <div className="mt-4 flex flex-wrap gap-2 md:mt-6">
                          {product.ingredients.slice(0, 3).map((item) => (
                            <span
                              key={item}
                              className="pill border border-[rgba(15,77,50,0.12)] bg-white/60 px-3 py-1 text-[10px] font-semibold text-[var(--green)] md:text-xs"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <div className="mt-1 text-sm text-[var(--muted)]">{product.origin}</div>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-7">
                          <Link
                            href={`/san-pham/${product.slug}`}
                            className="button button-secondary relative z-10 w-full justify-center px-4 py-3 text-sm md:w-auto md:px-6 md:text-base"
                          >
                            Xem chi tiết <ArrowRight size={18} />
                          </Link>
                          <div className="relative z-10 w-full md:w-auto">
                            <AddToCartButton slug={product.slug} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {homePageSections.brandProof ? (
          <section id="cau-chuyen" className="section pt-8 md:pt-24">
            <div className="container grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="eyebrow text-[11px] md:text-xs">
                  <span className="h-px w-8 bg-[var(--green)]" />
                  Câu chuyện Hòa Phúc
                </div>
                <h2 className="mt-4 section-title text-[clamp(1.8rem,4.5vw,4.6rem)]">
                  Mộc mạc nhưng cao cấp, thiên nhiên nhưng hiện đại.
                </h2>
                <p className="mt-4 section-copy text-[15px] md:text-[1.02rem]">
                  Website này được xây dựng như một storefront premium với cấu trúc SEO rõ ràng, hình ảnh lớn, nhịp
                  khoảng trắng sang trọng và hero video tạo ấn tượng ngay khi mở trang. Đây là nền tảng tốt để mở rộng
                  thêm blog, câu chuyện vùng nguyên liệu, tin tức và trang chi tiết sản phẩm trong các vòng tiếp theo.
                </p>
              </div>
              <div className="card rounded-[28px] p-6 md:p-7">
                <h3 className="text-xl font-semibold text-[var(--green-dark)]">Điểm nhấn triển khai</h3>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)]">
                  <li>SEO metadata đầy đủ, canonical và Open Graph.</li>
                  <li>Dữ liệu sản phẩm lưu local trong `data/products.ts`.</li>
                  <li>Hero video tối ưu cho mobile với poster và lazy-load theo section.</li>
                  <li>Thông tin thương hiệu đồng bộ với fanpage Nông Sản Hòa Phúc | Nho Quan.</li>
                  <li>Responsive tốt cho mobile, tablet và desktop.</li>
                </ul>
                <div className="mt-6 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/55 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Kênh chính thức</div>
                  <a
                    href="https://www.facebook.com/nongsanhoaphucnb/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-sm font-semibold text-[var(--green-dark)] underline decoration-[rgba(15,77,50,0.24)] underline-offset-4"
                  >
                    Fanpage Nông Sản Hòa Phúc | Nho Quan
                  </a>
                  <div className="mt-2 text-sm text-[var(--muted)]">Hotline/Zalo: +84 36 669 7135</div>
                </div>
                <div className="mt-4 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/55 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Thông tin doanh nghiệp</div>
                  <div className="mt-2 text-sm leading-7 text-[var(--green-dark)]">
                    CÔNG TY TNHH NÔNG SẢN HOÀ PHÚC
                    <br />
                    MST: 2700963962
                    <br />
                    Người đại diện: VŨ HUYỀN TRANG
                  </div>
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
                  <div className="eyebrow text-[11px] md:text-xs">
                    <span className="h-px w-8 bg-[var(--green)]" />
                    Blog mới
                  </div>
                  <h2 className="mt-4 section-title text-[clamp(1.8rem,4.5vw,4.6rem)]">
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
            <div className="container grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="card rounded-[28px] p-6 md:p-8 lg:p-10">
                <div className="eyebrow text-[11px] md:text-xs">
                  <span className="h-px w-8 bg-[var(--green)]" />
                  Mua hàng
                </div>
                <h2 className="mt-4 section-title text-[clamp(1.8rem,4.5vw,4.6rem)]">
                  Mua dễ, theo dõi dễ, phù hợp cho web và mini app sau này.
                </h2>
                <p className="mt-4 text-[15px] leading-8 text-[var(--muted)] md:text-base">
                  Quy trình đặt hàng được thiết kế ngắn gọn để khách dễ hiểu, đồng thời đủ linh hoạt để sau này thay bằng
                  checkout thật khi nối Supabase hoặc cổng thanh toán.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    { step: "01", title: "Chọn sản phẩm" },
                    { step: "02", title: "Thêm vào giỏ" },
                    { step: "03", title: "Chốt đơn" },
                  ].map((item) => (
                    <div key={item.step} className="rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">
                        Bước {item.step}
                      </div>
                      <div className="mt-3 text-sm font-semibold text-[var(--green-dark)]">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel overflow-hidden rounded-[28px]">
                <div className="grid gap-0 sm:grid-cols-2">
                  <Image src={products[1].boxImage} alt="Hộp trà Hòa Phúc" width={products[1].boxImageWidth} height={products[1].boxImageHeight} className="h-auto w-full" />
                  <Image src={products[2].boxImage} alt="Hộp trà Hòa Phúc" width={products[2].boxImageWidth} height={products[2].boxImageHeight} className="h-auto w-full" />
                  <Image src={products[3].boxImage} alt="Hộp trà Hòa Phúc" width={products[3].boxImageWidth} height={products[3].boxImageHeight} className="h-auto w-full" />
                  <div className="relative aspect-square bg-[linear-gradient(180deg,#0f4d32,#063b27)] p-6 text-white">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/75">Tối ưu cho</div>
                    <div className="mt-4 text-2xl font-semibold leading-[1.05]">Mua sắm, quà biếu và bài đăng social.</div>
                    <div className="mt-5 text-sm leading-7 text-white/80">
                      Một section có thể bỏ đi nếu bạn muốn trang chủ ngắn hơn, hoặc giữ lại để tăng độ chuyển đổi.
                    </div>
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
