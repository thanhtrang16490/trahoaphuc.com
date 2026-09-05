import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ProductCardActions } from "@/components/product-card-actions";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { getCatalog } from "@/lib/catalog";

export async function generateCategoryStaticParams() {
  const { categories } = await getCatalog();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateCategoryMetadata(slug: string) {
  const { categories } = await getCatalog();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `/muc-san-pham/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Nông Sản Hòa Phúc`,
      description: category.description,
      url: `https://hoaphucfarm.com/muc-san-pham/${category.slug}`,
    },
  };
}

export async function CategoryDetailPage({ slug }: { slug: string }) {
  const { categories, products } = await getCatalog();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const items = products.filter((product) => product.category === category.name);

  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Sản phẩm", href: "/san-pham" },
          { name: category.name, href: `/muc-san-pham/${category.slug}` },
        ]}
      />
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Mục sản phẩm
            </div>
            <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">{category.name}</h1>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
              {category.description}
            </p>
          </div>
          <Link href="/san-pham" className="button button-secondary">
            Tất cả sản phẩm
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
          {items.map((product) => {
            const price = product.price ?? getProductPrice(product.slug);
            return (
              <article key={product.slug} className="card overflow-hidden rounded-[22px] md:rounded-[32px]">
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brown)] md:text-xs">
                        {product.category}
                      </div>
                      <h2 className="mt-2 text-[14px] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--green-dark)] md:mt-3 md:text-2xl">
                        {product.name}
                      </h2>
                    </div>
                    <div className="shrink-0 rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[var(--green-dark)] md:px-3 md:text-[11px]">
                      {formatCurrency(price)}
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[var(--muted)] md:mt-3 md:text-sm md:leading-7">
                    {product.shortDescription}
                  </p>
                  <div className="mt-4 flex justify-end md:mt-5">
                    <ProductCardActions product={product} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
