import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo";
import { CategoryIndexClient } from "./category-index-client";

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

export default function CategoryIndexPage() {
  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Mục sản phẩm", href: "/muc-san-pham" }]} />
      <CategoryIndexClient />
    </main>
  );
}
