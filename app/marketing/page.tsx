import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo";
import { MarketingOnePage } from "@/components/marketing-onepage";

export const metadata: Metadata = {
  title: "Marketing Center",
  description: "Bảng điều hành kế hoạch marketing, nội dung và KPI của Nông Sản Hòa Phúc.",
  alternates: { canonical: "/marketing" },
};

export default function MarketingPage() {
  return (
    <main className="section pt-8 md:pt-12 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Marketing", href: "/marketing" }]} />
      <MarketingOnePage />
    </main>
  );
}
