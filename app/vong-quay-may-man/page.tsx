import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo";
import { LuckySpinClient } from "./lucky-spin-client";

export const metadata: Metadata = {
  title: "Vòng quay may mắn",
  description: "Mini game quay thưởng của Hòa Phúc với các phần quà ưu đãi hấp dẫn.",
  alternates: { canonical: "/vong-quay-may-man" },
  openGraph: {
    title: "Vòng quay may mắn | Nông Sản Hòa Phúc",
    description: "Mini game quay thưởng của Hòa Phúc với các phần quà ưu đãi hấp dẫn.",
    url: "https://hoaphucfarm.com/vong-quay-may-man",
  },
};

export default function LuckySpinPage() {
  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Vòng quay may mắn", href: "/vong-quay-may-man" }]} />
      <LuckySpinClient />
    </main>
  );
}
