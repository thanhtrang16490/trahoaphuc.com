import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ProductCardActions } from "@/components/product-card-actions";
import { ProductCatalogDesktop } from "@/components/product-catalog-desktop";

const categoryMap = [
  { label: "Tất cả", href: "/san-pham" },
  { label: "Trà thảo mộc", href: "/muc-san-pham/tra-thao-moc" },
  { label: "Dưỡng sinh", href: "/muc-san-pham/duong-sinh" },
  { label: "Đặc sản vùng miền", href: "/muc-san-pham/dac-san-vung-mien" },
];

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh sách sản phẩm Hòa Phúc gồm trà thảo mộc, dưỡng sinh và đặc sản vùng miền.",
  alternates: {
    canonical: "/san-pham",
  },
  openGraph: {
    title: "Sản phẩm | Nông Sản Hòa Phúc",
    description: "Danh sách sản phẩm Hòa Phúc gồm trà thảo mộc, dưỡng sinh và đặc sản vùng miền.",
    url: "https://hoaphucfarm.com/san-pham",
  },
};

export default function ProductsPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Sản phẩm", href: "/san-pham" }]} />
      <div className="md:hidden">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Danh mục sản phẩm
            </div>
            <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Tất cả sản phẩm Hòa Phúc</h1>
          </div>
          <Link href="/gio-hang" className="button button-primary">
            Giỏ hàng
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categoryMap.map((item) => (
            <Link key={item.label} href={item.href} className="pill border border-[rgba(15,77,50,0.12)] bg-white/55 px-4 py-2 text-sm font-semibold text-[var(--green-dark)]">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {products.map((product) => {
            const price = getProductPrice(product.slug);
            return (
              <article key={product.slug} className="card relative overflow-hidden rounded-[22px] md:rounded-[32px]">
                <Link href={`/san-pham/${product.slug}`} className="absolute inset-0 z-0" aria-label={product.name} />
                <div className="relative z-10">
                  <Link href={`/san-pham/${product.slug}`} className="block">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      className="h-auto w-full"
                    />
                  </Link>
                  <div className="p-3 md:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brown)] md:text-xs">{product.category}</div>
                        <h2 className="mt-2 text-[14px] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--green-dark)] md:mt-3 md:text-2xl">
                          {product.name}
                        </h2>
                      </div>
                    </div>
                    <div className="mt-2 inline-flex rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[var(--green-dark)] md:mt-3 md:px-3">
                      {formatCurrency(price)}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[var(--muted)] md:mt-3 md:text-sm md:leading-7">{product.shortDescription}</p>
                    <div className="mt-4 flex justify-end md:mt-5">
                      <ProductCardActions product={product} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      </div>
      <ProductCatalogDesktop products={products} />
    </main>
  );
}
