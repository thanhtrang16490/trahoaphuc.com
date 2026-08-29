import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Mục sản phẩm",
  description: "Các nhóm sản phẩm Hòa Phúc theo từng cụm nội dung để tối ưu SEO và trải nghiệm tìm kiếm.",
  alternates: {
    canonical: "/muc-san-pham",
  },
  openGraph: {
    title: "Mục sản phẩm | Nông Sản Hòa Phúc",
    description: "Các nhóm sản phẩm Hòa Phúc theo từng cụm nội dung để tối ưu SEO và trải nghiệm tìm kiếm.",
    url: "https://hoaphucfarm.com/muc-san-pham",
  },
};

export default function CategoriesPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Mục sản phẩm", href: "/muc-san-pham" }]} />
      <div className="container">
        <div>
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Mục sản phẩm
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Các nhóm sản phẩm Hòa Phúc</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Tách riêng từng nhóm sản phẩm giúp tăng độ phủ từ khóa, tạo landing page SEO sâu hơn và giúp khách hàng đi
            đúng nhóm sản phẩm họ cần.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/muc-san-pham/${category.slug}`}
              className="card rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1 md:rounded-[32px] md:p-7"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brown)]">
                0{index + 1}
              </div>
              <h2 className="mt-8 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--green-dark)]">
                {category.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{category.description}</p>
              <div className="mt-6 inline-flex rounded-full bg-[var(--green)] px-4 py-2 text-[12px] font-semibold text-white">
                Xem nhóm sản phẩm
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
