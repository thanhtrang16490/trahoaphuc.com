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
          <section className="section pt-6 md:pt-16">
            <div className="container grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
              <div className="order-2 lg:order-1">
                <div className="eyebrow text-[11px] md:text-xs">
                  <span className="h-px w-8 bg-[var(--green)]" />
                  Tinh hoa từ vùng đất lành
                </div>
                <h1 className="mt-4 max-w-[10ch] font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7.6rem)] leading-[0.88] tracking-[-0.05em] text-[var(--green-dark)] md:max-w-[11ch]">
                  Trà sạch vùng nguyên liệu, thiết kế như một thương hiệu cao cấp.
                </h1>
                <p className="mt-5 section-copy text-[15px] md:text-[1.02rem]">
                  Hòa Phúc kết hợp nông sản sạch, bao bì chỉn chu và trải nghiệm mua hàng hiện đại. Từ trà thảo mộc đến
                  quà biếu vùng miền, mọi thứ đều được kể bằng một giọng điệu rõ ràng và đáng tin.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 md:mt-8 md:gap-4">
                  <a className="button button-primary px-5 py-3 text-sm md:px-6 md:py-4 md:text-base" href="#san-pham-noi-bat">
                    Khám phá sản phẩm <ArrowRight size={18} />
                  </a>
                  <a className="button button-secondary px-5 py-3 text-sm md:px-6 md:py-4 md:text-base" href="/gioi-thieu">
                    Về Hòa Phúc
                  </a>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mt-10 md:gap-4">
                  {["Vùng nguyên liệu", "Thành phần tự nhiên", "Kiểm soát chất lượng", "Tinh hoa Việt Nam"].map((item) => (
                    <div key={item} className="panel rounded-[22px] p-3 md:rounded-[24px] md:p-4">
                      <div className="text-[11px] font-semibold text-[var(--green)] md:text-sm">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div ref={heroRef} className="order-1 lg:order-2">
                <div className="panel overflow-hidden rounded-[30px] md:rounded-[36px]">
                  <div className="relative bg-[linear-gradient(180deg,#ede2cb,#d5b074)]">
                    <Image
                      src="/media/video-tra-hoa-phuc-thumb.jpg"
                      alt="Khung hình giới thiệu trà Hòa Phúc"
                      width={products[0].imageWidth}
                      height={products[0].imageHeight}
                      className={`h-auto w-full transition-opacity duration-500 ${shouldLoadHeroVideo ? "opacity-0" : "opacity-100"}`}
                      priority
                    />
                    {shouldLoadHeroVideo ? (
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/media/video-tra-hoa-phuc.mp4"
                        poster="/media/video-tra-hoa-phuc-thumb.jpg"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="Video giới thiệu thương hiệu Hòa Phúc"
                        onCanPlay={() => setShouldLoadHeroVideo(true)}
                      />
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(15,77,50,0),rgba(15,77,50,0.58))] px-4 py-4 text-white md:px-6 md:py-5">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                          Video thương hiệu
                        </div>
                        <div className="mt-1 text-sm font-semibold md:text-base">Đang tải trải nghiệm video Hòa Phúc...</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {homePageSections.brandStory ? (
          <section id="ve-hoa-phuc" className="section pt-4 md:pt-8">
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
          <section className="section py-6 md:py-24">
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

        {homePageSections.featuredProducts ? (
          <section id="san-pham-noi-bat" className="section pt-6 md:pt-24">
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
