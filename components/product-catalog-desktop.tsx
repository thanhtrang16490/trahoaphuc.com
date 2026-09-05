"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CaretRight, GridFour, GridNine, List, MagnifyingGlass, Package, SortAscending, SortDescending, X } from "@phosphor-icons/react";
import type { Product } from "@/data/products";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { ProductCardActions } from "@/components/product-card-actions";

const categories = [
  { label: "Tất cả", href: "/san-pham" },
  { label: "Trà thảo mộc", href: "/muc-san-pham/tra-thao-moc" },
  { label: "Dưỡng sinh", href: "/muc-san-pham/duong-sinh" },
  { label: "Đặc sản vùng miền", href: "/muc-san-pham/dac-san-vung-mien" },
];

export function ProductCatalogDesktop({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"az" | "za" | "price-asc" | "price-desc">("az");
  const [columns, setColumns] = useState<1 | 3 | 4>(4);
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      if (!normalized) return true;
      return [product.name, product.category, product.shortDescription, ...product.ingredients].join(" ").toLowerCase().includes(normalized);
    });

    return [...result].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name, "vi");
      if (sort === "za") return b.name.localeCompare(a.name, "vi");
      if (sort === "price-asc") return getProductPrice(a.slug) - getProductPrice(b.slug);
      return getProductPrice(b.slug) - getProductPrice(a.slug);
    });
  }, [products, query, sort]);

  return (
    <div className="hidden md:block">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#063b27] via-[#0f4d32] to-[#1b6a43] py-14 text-white lg:py-16">
        <div aria-hidden="true" className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[rgba(216,183,123,0.16)]" />
        <div aria-hidden="true" className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[rgba(159,210,15,0.1)]" />
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[var(--beige)]"><Package size={24} weight="bold" /></div>
              <div>
                <p className="text-sm text-white/55">Danh mục sản phẩm</p>
                <h1 className="text-3xl font-bold tracking-[-0.03em]">Tất cả sản phẩm</h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">Trà thảo mộc, sản phẩm dưỡng sinh và đặc sản Việt được Hòa Phúc chọn lọc, đóng gói chỉn chu.</p>
            <div className="mt-6 flex items-center gap-6">
              <div><span className="text-2xl font-bold text-[var(--beige)]">{products.length}</span> <span className="text-sm text-white/55">sản phẩm</span></div>
              <div className="h-8 w-px bg-white/20" />
              <div><span className="text-2xl font-bold text-[var(--beige)]">{categories.length - 1}</span> <span className="text-sm text-white/55">nhóm sản phẩm</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="transition-colors hover:text-[var(--green)]">Trang chủ</Link>
                <CaretRight className="h-3 w-3 shrink-0" />
                <span className="font-medium text-gray-900">Sản phẩm</span>
              </div>
              <div className="flex items-center gap-2">
                {searchOpen ? (
                  <div className="relative w-64">
                    <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm sản phẩm..." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-9 text-sm outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[rgba(15,77,50,0.15)]" />
                    <button type="button" onClick={() => { setQuery(""); setSearchOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Đóng tìm kiếm"><X size={16} /></button>
                  </div>
                ) : <button type="button" onClick={() => setSearchOpen(true)} className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition-colors hover:border-[var(--green)] hover:bg-gray-50" title="Tìm sản phẩm"><MagnifyingGlass size={17} /></button>}

                <div className="flex items-center gap-1 rounded-lg border border-gray-300 p-1">
                  <button type="button" onClick={() => setColumns(1)} className={`rounded p-2 ${columns === 1 ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Danh sách 1 cột"><List size={16} /></button>
                  <button type="button" onClick={() => setColumns(3)} className={`rounded p-2 ${columns === 3 ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Lưới 3 cột"><GridNine size={16} /></button>
                  <button type="button" onClick={() => setColumns(4)} className={`rounded p-2 ${columns === 4 ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Lưới 4 cột"><GridFour size={16} /></button>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-gray-300 p-1">
                  <button type="button" onClick={() => setSort("az")} className={`rounded p-2 ${sort === "az" ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Sắp xếp A-Z"><SortAscending size={16} /></button>
                  <button type="button" onClick={() => setSort("za")} className={`rounded p-2 ${sort === "za" ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Sắp xếp Z-A"><SortDescending size={16} /></button>
                  <button type="button" onClick={() => setSort("price-asc")} className={`rounded p-2 ${sort === "price-asc" ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Giá tăng dần"><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => setSort("price-desc")} className={`rounded p-2 ${sort === "price-desc" ? "bg-[var(--green)] text-white" : "text-gray-600 hover:bg-gray-100"}`} title="Giá giảm dần"><ArrowDown size={16} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            {categories.map((category) => <Link key={category.label} href={category.href} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${category.label === "Tất cả" ? "border-[var(--green)] bg-[var(--green)] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-[var(--green)] hover:text-[var(--green)]"}`}>{category.label}</Link>)}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white py-16 text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
          ) : (
            <div className={columns === 1 ? "flex flex-col gap-4" : columns === 3 ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"}>
              {filteredProducts.map((product) => (
                <article key={product.slug} className={`group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--green)] hover:shadow-xl ${columns === 1 ? "flex" : ""}`}>
                  <Link href={`/san-pham/${product.slug}`} className={`relative block overflow-hidden bg-white ${columns === 1 ? "h-48 w-48 shrink-0" : "aspect-square w-full"}`}>
                    <Image src={product.image} alt={product.name} fill className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]" sizes={columns === 1 ? "192px" : "(min-width: 1024px) 25vw, 50vw"} />
                  </Link>
                  <div className={`flex min-w-0 flex-1 flex-col gap-3 p-4 ${columns === 1 ? "justify-center" : ""}`}>
                    <Link href={`/san-pham/${product.slug}`} className="block">
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brown)]">{product.category}</div>
                      <h2 className="line-clamp-2 text-[14px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[var(--green)]">{product.name}</h2>
                    </Link>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 text-xs"><span className="text-gray-500">Quy cách</span><span className="text-right font-semibold text-gray-900">{product.packageLabel}</span></div>
                      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 text-xs"><span className="text-gray-500">Xuất xứ</span><span className="font-semibold text-gray-900">{product.origin}</span></div>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                      <span className="text-right"><span className="block text-sm font-bold text-[var(--green)]">{formatCurrency(product.price ?? getProductPrice(product.slug))}</span>{product.originalPrice && product.originalPrice > (product.price ?? 0) ? <span className="block text-[11px] text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span> : null}</span>
                      <ProductCardActions product={product} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
