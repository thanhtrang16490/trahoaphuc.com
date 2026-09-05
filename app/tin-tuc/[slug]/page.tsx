import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo";
import { MobileBackHeader } from "@/components/mobile-back-header";
import { getNewsPostBySlug, getNewsPosts } from "@/lib/news";
import { formatDateLong } from "@/lib/date";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getNewsPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/tin-tuc/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, alt: post.title }],
      url: `https://hoaphucfarm.com/tin-tuc/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = (await getNewsPosts()).filter((item) => item.slug !== post.slug).slice(0, 3);
  const publishedDate = formatDateLong(post.date);

  return (
    <main className="section !pt-0 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Tin tức", href: "/tin-tuc" }, { name: post.title, href: `/tin-tuc/${post.slug}` }]} />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`https://hoaphucfarm.com/tin-tuc/${post.slug}`}
        image={post.coverImage}
        datePublished={post.date}
        dateModified={post.date}
        authorName="Nông Sản Hòa Phúc"
      />

      <div className="container">
        <MobileBackHeader href="/tin-tuc" section="Tin tức" title="Bài viết chi tiết" />

        <article className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_42px_rgba(15,77,50,0.08)]">
            <div className="relative aspect-[16/10] bg-[linear-gradient(180deg,#edd9ad,#d4ae6a)]">
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 52vw" className="object-cover" priority />
            </div>
            <div className="px-5 py-5 md:px-8 md:py-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span className="rounded-full bg-[rgba(15,77,50,0.06)] px-3 py-1 text-[var(--green-dark)]">{post.category}</span>
                <span>{publishedDate}</span>
                <span>{post.readTime}</span>
              </div>
              <h1 className="mt-4 text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--green-dark)]">
                {post.title}
              </h1>
              <p className="mt-4 text-[16px] leading-8 text-[var(--muted)]">{post.excerpt}</p>

              <div className="mt-6 space-y-4 text-[16px] leading-8 text-[var(--green-dark)]">
                {post.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 rounded-[24px] border border-[rgba(15,77,50,0.1)] bg-[rgba(15,77,50,0.04)] p-4 md:p-5">
                <div className="text-sm font-semibold text-[var(--green-dark)]">Nguồn bài viết</div>
                <p className="mt-1 text-sm leading-7 text-[var(--muted)]">
                  Nội dung được tổng hợp từ fanpage chính thức của Hòa Phúc để đồng bộ thông tin thương hiệu.
                </p>
                {post.sourceUrl ? (
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center rounded-full bg-[var(--green)] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Xem bài gốc trên fanpage
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_42px_rgba(15,77,50,0.08)] md:p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Thông tin bài viết</div>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--green-dark)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--muted)]">Danh mục</span>
                  <span className="font-semibold">{post.category}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--muted)]">Ngày đăng</span>
                  <span className="font-semibold">{publishedDate}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--muted)]">Thời gian đọc</span>
                  <span className="font-semibold">{post.readTime}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_42px_rgba(15,77,50,0.08)] md:p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Bài viết liên quan</div>
              <div className="mt-4 grid gap-4">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tin-tuc/${item.slug}`}
                    className="overflow-hidden rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.02)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#edd9ad,#d4ae6a)]">
                        <Image src={item.coverImage} alt={item.title} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brown)]">
                          {item.category}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[var(--green-dark)]">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{formatDateLong(item.date)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </article>
      </div>
    </main>
  );
}
