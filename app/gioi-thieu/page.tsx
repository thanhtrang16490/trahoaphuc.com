import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { brand } from "@/data/site";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Giới thiệu Hòa Phúc",
  description:
    "Tìm hiểu câu chuyện Nông Sản Hòa Phúc, thương hiệu trà thảo mộc và nông sản Việt từ Cúc Phương, Ninh Bình.",
  alternates: { canonical: "/gioi-thieu" },
  openGraph: {
    title: "Giới thiệu Hòa Phúc | Trà thảo mộc Việt",
    description:
      "Câu chuyện về trà thảo mộc, nông sản Việt và những món quà mang dấu ấn Cố đô từ Hòa Phúc.",
    url: "https://hoaphucfarm.com/gioi-thieu",
    images: [{ url: "/hero-hoaphuc.webp", alt: "Sản phẩm trà thảo mộc Hòa Phúc" }],
  },
};

const values = [
  {
    number: "01",
    title: "Tôn trọng vùng đất",
    copy: "Bắt đầu từ Cúc Phương, Ninh Bình và cảm hứng từ những vùng nguyên liệu Việt Nam.",
  },
  {
    number: "02",
    title: "Giữ vị dễ gần",
    copy: "Chọn những công thức có hương vị thanh lành, phù hợp để thưởng thức trong ngày.",
  },
  {
    number: "03",
    title: "Trao tặng chỉn chu",
    copy: "Đặt sản phẩm vào một diện mạo đẹp, để món quà vừa hữu ích vừa đáng nhớ.",
  },
];

const journey = [
  {
    number: "01",
    title: "Từ nông sản Việt",
    copy: "Hòa Phúc trân trọng những nguyên liệu quen thuộc của quê hương và tìm cách kể lại chúng bằng một trải nghiệm hiện đại.",
  },
  {
    number: "02",
    title: "Đến những dòng trà dễ uống",
    copy: "Trà thảo mộc, trà dưỡng sinh và các sản phẩm chăm sóc hằng ngày được sắp xếp rõ ràng để bạn dễ chọn theo nhu cầu.",
  },
  {
    number: "03",
    title: "Trở thành món quà có câu chuyện",
    copy: "Mỗi hộp trà mang theo một phần hương vị vùng miền, phù hợp để dùng cho mình hoặc trao tặng người thân.",
  },
];

export default async function IntroductionPage() {
  const { products, categories } = await getCatalog();
  const stats = [
    { value: String(products.length).padStart(2, "0"), label: "sản phẩm đang có" },
    { value: String(categories.length).padStart(2, "0"), label: "nhóm sản phẩm" },
    { value: "Cúc Phương", label: "điểm khởi đầu" },
  ];

  return (
    <main className="overflow-hidden pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Giới thiệu", href: "/gioi-thieu" }]} />

      <section aria-labelledby="intro-title" className="section pt-10 md:pt-16 lg:pt-20">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Câu chuyện Hòa Phúc
            </div>
            <h1 id="intro-title" className="mt-5 max-w-[11ch] section-title text-[clamp(3rem,7vw,6.8rem)]">
              Nông sản Việt, kể bằng vị trà.
            </h1>
            <p className="mt-6 max-w-[54ch] text-[15px] leading-8 text-[var(--muted)] md:text-lg md:leading-9">
              Từ Cúc Phương, Ninh Bình, Hòa Phúc chọn những nguyên liệu thân thuộc để tạo nên các sản phẩm trà thảo mộc và nông sản chỉn chu, dễ thưởng thức và dễ trao tặng.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/san-pham" className="button button-primary">
                Khám phá sản phẩm
              </Link>
              <Link href="/gioi-thieu/cau-chuyen-thuong-hieu" className="button button-secondary">
                Đọc câu chuyện
              </Link>
            </div>
            <div className="mt-8 text-sm font-medium text-[var(--green-dark)]">Cúc Phương, Ninh Bình</div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px]">
            <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-[rgba(218,169,91,0.22)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[38px] bg-[#e9dfc9] p-5 shadow-[0_25px_70px_rgba(39,57,39,0.14)] md:p-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#f7f1e4]">
                <Image
                  src="/hero-hoaphuc.webp"
                  alt="Sản phẩm trà thảo mộc Hòa Phúc"
                  fill
                  sizes="(max-width: 1024px) 90vw, 55vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute bottom-9 left-9 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--green-dark)] shadow-sm backdrop-blur md:bottom-12 md:left-12">
                Một món quà mang dấu ấn Cố đô
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Thông tin nhanh về Hòa Phúc" className="section py-0">
        <div className="container">
          <div className="grid border-y border-[rgba(15,77,50,0.14)] py-6 sm:grid-cols-3 sm:py-7">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-1 py-3 sm:px-6 sm:py-0 ${index > 0 ? "border-t border-[rgba(15,77,50,0.12)] sm:border-l sm:border-t-0" : ""}`}
              >
                <div className="font-display text-2xl leading-none tracking-[-0.03em] text-[var(--green-dark)] md:text-3xl">{stat.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="section pt-20 md:pt-28">
        <div className="container">
          <div className="max-w-2xl">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Điều Hòa Phúc theo đuổi
            </div>
            <h2 id="values-title" className="mt-4 section-title text-[clamp(2.25rem,5vw,4.8rem)]">
              Để nông sản quê mình có một diện mạo đáng nhớ.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {values.map(({ number, title, copy }) => (
              <article key={title} className="card rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(15,77,50,0.09)] font-display text-xl text-[var(--green)]">
                  {number}
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em] text-[var(--green-dark)]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-title" className="section pt-20 md:pt-28">
        <div className="container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Hành trình sản phẩm
            </div>
            <h2 id="journey-title" className="mt-4 section-title text-[clamp(2.25rem,5vw,4.5rem)]">Một hộp trà, ba lớp câu chuyện.</h2>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-8 text-[var(--muted)]">
              Từ nguyên liệu, công thức đến cách trao đi, Hòa Phúc muốn mỗi sản phẩm đều có lý do để bạn tin và nhớ.
            </p>
          </div>
          <div className="grid gap-4">
            {journey.map((item) => (
              <article key={item.number} className="rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-[#f6f1e6] p-6 transition-colors duration-300 hover:border-[rgba(15,77,50,0.28)] md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <span className="font-display text-4xl text-[var(--brown)]">{item.number}</span>
                  <span className="mt-1 text-xl text-[var(--green)]" aria-hidden="true">+</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-[var(--green-dark)]">{item.title}</h3>
                <p className="mt-3 max-w-[55ch] text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="collection-title" className="section pt-20 md:pt-28">
        <div className="container grid items-end gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Bộ sưu tập Hòa Phúc
            </div>
            <h2 id="collection-title" className="mt-4 section-title text-[clamp(2.25rem,5vw,4.5rem)]">
              Chọn một hương vị cho hôm nay, hoặc một món quà cho người bạn quý.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-8 text-[var(--muted)]">
              Trà thanh nhiệt, trà dưỡng tâm, trà gạo lứt lá sen và những sản phẩm nông sản tự nhiên đang chờ bạn khám phá.
            </p>
            <Link href="/san-pham" className="button button-secondary mt-8">
              Xem đủ sản phẩm
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {products.slice(0, 4).map((product) => (
              <Link key={product.slug} href={`/san-pham/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[26px] bg-[#f4eee1] p-4 md:p-6">
                <div className="relative aspect-square">
                  <Image
                    src={product.boxImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 26vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 min-h-[2.75rem] text-sm font-semibold leading-6 text-[var(--green-dark)]">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="section pb-8 pt-20 md:pb-16 md:pt-28">
        <div className="container">
          <div className="rounded-[34px] bg-[var(--green-dark)] px-6 py-10 text-white md:px-12 md:py-14 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="eyebrow text-[11px] text-[rgba(255,255,255,0.68)] md:text-xs">
                <span className="h-px w-8 bg-[var(--gold)]" />
                Kết nối cùng Hòa Phúc
              </div>
              <h2 id="contact-title" className="mt-4 font-display text-4xl leading-[0.98] tracking-[-0.04em] md:text-6xl">
                Tìm sản phẩm phù hợp với câu chuyện bạn muốn trao.
              </h2>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0 lg:flex-col">
              <Link href="/lien-he" className="button bg-white text-[var(--green-dark)] hover:bg-[#f3ead7]">
                Liên hệ tư vấn
              </Link>
              <a href={brand.shopee} target="_blank" rel="noreferrer" className="button border border-white/25 text-white hover:bg-white/10">
                Mua trên Shopee
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
