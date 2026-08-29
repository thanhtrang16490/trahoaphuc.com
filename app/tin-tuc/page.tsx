import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, chia sẻ và câu chuyện thương hiệu từ Nông Sản Hòa Phúc.",
};

export default function BlogIndexPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Tin tức", href: "/tin-tuc" }]} />
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Tin tức
            </div>
            <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Blog Hòa Phúc</h1>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
              Chia sẻ về trà thảo mộc, quà biếu, lối sống lành mạnh và các câu chuyện xoay quanh thương hiệu Nông Sản
              Hòa Phúc.
            </p>
          </div>
          <Link href="/gioi-thieu/cau-chuyen-thuong-hieu" className="button button-secondary">
            Câu chuyện thương hiệu
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/tin-tuc/${post.slug}`}
              className="card overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-1 md:rounded-[32px]"
            >
              <div className="relative aspect-[4/3] bg-[linear-gradient(180deg,#edd9ad,#d4ae6a)]">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-5 md:p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brown)]">
                  {post.category}
                </div>
                <h2 className="mt-3 text-[1.45rem] font-semibold leading-[1.06] tracking-[-0.03em] text-[var(--green-dark)]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
                {post.sourceUrl ? (
                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Nguồn: {post.sourceName ?? "Facebook"} · Fanpage chính thức
                  </div>
                ) : null}
                <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
