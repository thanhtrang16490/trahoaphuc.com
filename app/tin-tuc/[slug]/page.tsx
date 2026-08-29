import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();
  const lead = post.content[0];

  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Tin tức", href: "/tin-tuc" },
          { name: post.title, href: `/tin-tuc/${post.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: [post.coverImage],
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: "Nông Sản Hòa Phúc",
            },
            publisher: {
              "@type": "Organization",
              name: "Nông Sản Hòa Phúc",
            },
            mainEntityOfPage: `https://hoaphucfarm.com/tin-tuc/${post.slug}`,
          }),
        }}
      />
      <div className="container">
        <div className="max-w-4xl">
          <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)]">
            Tất cả bài viết
          </Link>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="rounded-full bg-[rgba(15,77,50,0.08)] px-3 py-1 text-[var(--green-dark)]">{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
            {post.sourceUrl ? <span>{post.sourceName ?? "Facebook fanpage"}</span> : null}
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.8rem)]">{post.title}</h1>
          <p className="mt-5 max-w-[68ch] text-[15px] leading-8 text-[var(--muted)] md:text-lg">
            {post.excerpt}
          </p>
          {lead ? (
            <div className="mt-6 rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.05)] p-5 md:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Tóm tắt nhanh</div>
              <p className="mt-3 text-sm leading-7 text-[var(--green-dark)] md:text-base">{lead}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 overflow-hidden rounded-[32px]">
          <Image src={post.coverImage} alt={post.title} width={1400} height={1050} className="h-auto w-full" priority />
        </div>

        <article className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="space-y-6 text-[15px] leading-8 text-[var(--muted)] md:text-base">
              {post.content.map((paragraph, index) => (
                <p key={paragraph}>
                  {index === 0 ? <span className="font-semibold text-[var(--green-dark)]">{paragraph}</span> : paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Nội dung biên tập từ các bài đăng công khai trên fanpage.",
                "Giữ tinh thần thương hiệu, đồng thời tối ưu cho SEO và hành trình mua hàng.",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-4 text-sm leading-7 text-[var(--green-dark)]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Khám phá thêm
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
              Bài viết cùng chủ đề
            </h2>
            <div className="mt-6 space-y-4">
              {blogPosts
                .filter((item) => item.slug !== post.slug)
                .slice(0, 3)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tin-tuc/${item.slug}`}
                    className="block rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-4"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">
                      {item.category}
                    </div>
                    <div className="mt-2 text-sm font-semibold leading-6 text-[var(--green-dark)]">{item.title}</div>
                  </Link>
                ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.06)] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">CTA</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Xem sản phẩm hoặc liên hệ fanpage để được tư vấn chọn trà phù hợp hơn.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/san-pham" className="button button-primary justify-center">
                  Xem sản phẩm
                </Link>
                <a
                  href="https://www.facebook.com/nongsanhoaphucnb/"
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary justify-center"
                >
                  Nhắn fanpage
                </a>
              </div>
              {post.sourceUrl ? (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--green)] underline decoration-[rgba(15,77,50,0.22)] underline-offset-4"
                >
                  Xem bài gốc trên fanpage
                </a>
              ) : null}
            </div>

            <div className="mt-6 rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Từ fanpage</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Bài viết này được biên tập từ nội dung công khai trên fanpage chính thức để đồng bộ thương hiệu, tăng độ tin
                cậy và giúp khách dễ xem lại trên website.
              </p>
            </div>
          </aside>
        </article>
      </div>
    </main>
  );
}
