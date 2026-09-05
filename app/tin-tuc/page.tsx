import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getNewsPosts } from "@/lib/news";

export const metadata: Metadata = {
  title: "Tin tức và câu chuyện Hòa Phúc",
  description: "Đọc chia sẻ về trà thảo mộc, cách chọn quà biếu, lối sống cân bằng và câu chuyện Nông Sản Hòa Phúc.",
  alternates: { canonical: "/tin-tuc" },
  openGraph: {
    title: "Tin tức và câu chuyện Hòa Phúc",
    description: "Những câu chuyện nhỏ quanh trà thảo mộc, nông sản Việt và món quà mang dấu ấn Cúc Phương.",
    url: "https://hoaphucfarm.com/tin-tuc",
  },
};

const categoryOrder = ["Trà thảo mộc", "Quà biếu", "Xu hướng", "Câu chuyện thương hiệu", "Lối sống", "Chăm sóc"];
export default async function BlogIndexPage({ searchParams }: BlogIndexContentProps) {
  return <BlogIndexContent searchParams={searchParams} />;
}

type BlogIndexContentProps = {
  searchParams?: Promise<{ category?: string }>;
};

async function BlogIndexContent({ searchParams }: BlogIndexContentProps = {}) {
  const params = searchParams ? await searchParams : {};
  const blogPosts = await getNewsPosts();
  const categoryCounts = blogPosts.reduce<Record<string, number>>((counts, post) => {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
    return counts;
  }, {});
  const featuredPosts = blogPosts.slice(0, 3);
  const selectedCategory = categoryOrder.includes(params.category ?? "") ? params.category : null;
  const visiblePosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts;

  return (
    <main className="overflow-hidden pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Tin tức", href: "/tin-tuc" }]} />

      <section aria-labelledby="news-title" className="section pt-10 md:pt-16 lg:pt-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[rgba(15,77,50,0.14)] pb-8 md:pb-10">
            <div>
              <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Tạp chí Hòa Phúc</div>
              <h1 id="news-title" className="mt-5 max-w-[10ch] section-title text-[clamp(3rem,7vw,6.5rem)]">Những câu chuyện để nhâm nhi cùng tách trà.</h1>
            </div>
            <div className="max-w-[40ch]">
              <p className="text-[15px] leading-8 text-[var(--muted)] md:text-base">Chia sẻ về trà thảo mộc, quà biếu, lối sống cân bằng và hành trình Hòa Phúc kể câu chuyện nông sản Việt.</p>
              <Link href="/gioi-thieu/cau-chuyen-thuong-hieu" className="button button-secondary mt-5">Câu chuyện thương hiệu</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Bài viết mới</div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{visiblePosts.length} bài viết</span>
            </div>

            {selectedCategory ? (
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[18px] bg-[rgba(15,77,50,0.06)] px-4 py-3 text-sm text-[var(--muted)]">
                Đang xem: <strong className="text-[var(--green-dark)]">{selectedCategory}</strong>
                <Link href="/tin-tuc" className="font-semibold text-[var(--green)] underline underline-offset-4">Xem tất cả</Link>
              </div>
            ) : null}

            <div className="divide-y divide-[rgba(15,77,50,0.14)] border-y border-[rgba(15,77,50,0.14)]">
              {visiblePosts.map((post, index) => (
                <article key={post.slug} className="group py-6 first:pt-0 last:pb-0 md:py-8">
                  <Link href={`/tin-tuc/${post.slug}`} className="grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center md:grid-cols-[260px_minmax(0,1fr)] md:gap-7">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#edd9ad,#d4ae6a)]">
                      <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 640px) 100vw, 260px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      {index === 0 ? <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--green-dark)] backdrop-blur">Mới nhất</span> : null}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">
                        <span>{post.category}</span><span className="text-[var(--muted)]">{post.date}</span><span className="text-[var(--muted)]">{post.readTime}</span>
                      </div>
                      <h2 className="mt-3 max-w-[22ch] text-[clamp(1.45rem,3vw,2.35rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--green-dark)]">{post.title}</h2>
                      <p className="mt-3 max-w-[62ch] text-sm leading-7 text-[var(--muted)] md:text-[15px]">{post.excerpt}</p>
                      <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--green)] underline decoration-[rgba(15,77,50,0.25)] underline-offset-4">Đọc bài viết <span aria-hidden="true">→</span></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside aria-label="Điều hướng tin tức" className="space-y-5 lg:sticky lg:top-28">
            <section className="rounded-[28px] bg-[var(--green-dark)] p-6 text-white shadow-[0_20px_44px_rgba(6,59,39,0.14)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Đọc theo chủ đề</div>
              <div className="mt-5 space-y-1">
                {categoryOrder.map((category) => (
                  <Link key={category} href={`/tin-tuc?category=${encodeURIComponent(category)}`} className="flex items-center justify-between gap-3 rounded-[16px] px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                    <span>{category}</span><span className="text-xs text-white/45">{categoryCounts[category] ?? 0}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/55 p-5 md:p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Bài nên đọc trước</div>
              <div className="mt-4 space-y-4">
                {featuredPosts.map((post, index) => (
                  <Link key={post.slug} href={`/tin-tuc/${post.slug}`} className="group flex gap-3">
                    <span className="font-display text-2xl text-[var(--brown)]">0{index + 1}</span>
                    <span className="min-w-0"><span className="block text-sm font-semibold leading-6 text-[var(--green-dark)] transition-colors group-hover:text-[var(--green)]">{post.title}</span><span className="mt-1 block text-xs text-[var(--muted)]">{post.readTime}</span></span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] bg-[#f3ead9] p-6 md:p-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Từ câu chuyện đến lựa chọn</div>
              <h2 className="mt-4 text-2xl font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--green-dark)]">Tìm hương vị hợp với bạn.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Khám phá các dòng trà thảo mộc, sản phẩm dưỡng sinh và đặc sản vùng miền của Hòa Phúc.</p>
              <Link href="/san-pham" className="button button-primary mt-5 w-full justify-center">Xem sản phẩm</Link>
            </section>

            <section className="rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/55 p-6 md:p-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Kênh chính thức</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Theo dõi thêm những cập nhật mới từ Hòa Phúc trên Fanpage hoặc mua hàng tại Shopee.</p>
              <div className="mt-5 flex flex-col gap-3"><a href="https://www.facebook.com/nongsanhoaphucnb/" target="_blank" rel="noreferrer" className="button button-secondary justify-center">Mở Fanpage</a><a href="https://shopee.vn/nongsanhoaphuc" target="_blank" rel="noreferrer" className="button button-secondary justify-center">Mở Shopee</a></div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
