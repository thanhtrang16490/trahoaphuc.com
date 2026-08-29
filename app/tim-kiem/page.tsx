"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, FunnelSimple, MagnifyingGlass, Sparkle, Tag } from "@phosphor-icons/react";
import { products } from "@/data/products";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { useMobileScrollVisibility } from "@/components/use-mobile-scroll-visibility";

const categoryMap = [
  { label: "Tất cả", value: "all" },
  { label: "Trà thảo mộc", value: "Trà thảo mộc" },
  { label: "Dưỡng sinh", value: "Dưỡng sinh" },
  { label: "Đặc sản vùng miền", value: "Đặc sản vùng miền" },
];

const quickChips = [
  "Trà Dưỡng Tâm An Nhiên",
  "Trà Thanh Nhiệt Hòa Phúc",
  "Trà Gạo Lứt Lá Sen",
  "Trà Bát Bảo",
  "Trà Thanh Nhiệt Mát Gan",
  "Trà thảo mộc",
  "Dưỡng sinh",
  "Đặc sản vùng miền",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { hidden } = useMobileScrollVisibility();

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchCategory = activeCategory === "all" ? true : product.category === activeCategory;
      const matchQuery =
        normalizedQuery.length === 0
          ? true
          : [product.name, product.category, product.shortDescription, product.ingredients.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery);

      return matchCategory && matchQuery;
    });
  }, [activeCategory, query]);

  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <section className="md:hidden">
        <div className={`container transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
          <div className="-mx-4 sticky top-0 z-40 border-b border-[rgba(15,77,50,0.08)] bg-[rgba(255,255,255,0.92)]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link
                href="/san-pham"
                aria-label="Quay lại danh sách sản phẩm"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)] shadow-[0_10px_18px_rgba(15,77,50,0.08)]"
              >
                <span className="text-[18px] leading-none">‹</span>
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Sản phẩm</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">Tìm kiếm</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[rgba(15,77,50,0.08)] bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <label className="flex h-14 flex-1 items-center gap-3 rounded-[18px] border-2 border-transparent bg-[linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#ff7a18,#f04,#c084fc)_border-box] px-4 shadow-[0_8px_24px_rgba(15,77,50,0.08)]">
              <MagnifyingGlass size={22} className="shrink-0 text-[var(--muted)]" />
              <input
                className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-[var(--muted)]"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm nhanh sản phẩm..."
              />
            </label>
            <button
              type="button"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.04)] text-[var(--green-dark)] shadow-[0_8px_24px_rgba(15,77,50,0.06)]"
              aria-label="Lọc"
            >
              <FunnelSimple size={24} weight="bold" />
            </button>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryMap.map((item) => {
              const active = activeCategory === item.value;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveCategory(item.value)}
                  className={`shrink-0 rounded-[14px] px-4 py-3 text-[14px] font-semibold transition-colors ${
                    active
                      ? "bg-[#ff4d1c] text-white shadow-[0_10px_18px_rgba(255,77,28,0.22)]"
                      : "bg-[rgba(15,77,50,0.04)] text-[var(--green-dark)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[linear-gradient(180deg,#fff,rgba(246,241,231,0.65))] px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickChips.map((chip) => (
              <Link
                key={chip}
                href={`/tim-kiem?q=${encodeURIComponent(chip)}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(15,77,50,0.08)] bg-white px-3.5 py-2 text-[13px] font-semibold text-[var(--green-dark)] shadow-[0_8px_18px_rgba(15,77,50,0.05)]"
                onClick={() => setQuery(chip)}
              >
                <Sparkle size={14} weight="fill" className="text-[#ff7a18]" />
                {chip}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white px-4 pb-6 pt-2">
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const price = getProductPrice(product.slug);
              return (
                <article
                  key={product.slug}
                  className="overflow-hidden rounded-[18px] border-2 border-[#f5d114] bg-white shadow-[0_8px_20px_rgba(15,77,50,0.08)]"
                >
                  <Link href={`/san-pham/${product.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-[#f5f5f1]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                      <div className="absolute right-3 top-3 rounded-full bg-[#ffd91a] px-3 py-1 text-[12px] font-semibold text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                        ★ BEST SELLER
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="inline-flex rounded-[8px] border border-[#ff7a18] px-1.5 py-0.5 text-[10px] font-semibold text-[#ff7a18]">
                        MALL
                      </div>
                      <h2 className="mt-2 line-clamp-2 text-[14px] font-medium leading-[1.35] tracking-[-0.01em] text-[#222]">
                        {product.name}
                      </h2>
                      <div className="mt-2 text-[20px] font-semibold leading-none text-[#f04b22]">
                        {formatCurrency(price)}
                      </div>
                      <div className="mt-3 rounded-md bg-[#fdeaa7] px-3 py-2 text-[12px] font-semibold text-[#d97800]">
                        #SanPhamChinhHang
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[12px] text-[#4b4b4b]">
                        <span className="text-[#f5c400]">★</span>
                        <span>5.00</span>
                        <span className="text-[#d0d0d0]">|</span>
                        <span>{product.category === "Dưỡng sinh" ? "315 đã bán" : "588 đã bán"}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[12px]">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#ff7a18] px-2.5 py-1 text-white">
                          <Tag size={12} weight="fill" />
                          Giao nhanh
                        </span>
                        <span className="text-[#4b4b4b]">| Giá tốt</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="mt-6 rounded-[22px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.04)] p-5 text-sm leading-7 text-[var(--muted)]">
              Không tìm thấy sản phẩm phù hợp. Thử đổi từ khóa hoặc chọn danh mục khác để xem gợi ý.
            </div>
          ) : null}
        </div>
      </section>

      <section className="container hidden md:block section pt-10 md:pt-14">
        <div className="max-w-3xl">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Tìm kiếm
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Tìm sản phẩm Hòa Phúc</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Trang tìm kiếm tối ưu cho mobile theo phong cách mini app, còn trên desktop vẫn giữ nhịp đọc gọn và rõ.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="flex min-h-14 items-center gap-3 rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-white px-4 shadow-[0_8px_24px_rgba(15,77,50,0.06)]">
            <MagnifyingGlass size={22} className="shrink-0 text-[var(--muted)]" />
            <input
              className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-[var(--muted)]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm nhanh sản phẩm..."
            />
          </label>
          <button type="button" className="rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-white px-5 py-4 font-semibold text-[var(--green-dark)]">
            Bộ lọc
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {categoryMap.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveCategory(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeCategory === item.value
                  ? "bg-[var(--green)] text-white"
                  : "border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const price = getProductPrice(product.slug);
            return (
              <article key={product.slug} className="card overflow-hidden rounded-[28px]">
                <Link href={`/san-pham/${product.slug}`}>
                  <Image src={product.image} alt={product.name} width={product.imageWidth} height={product.imageHeight} className="h-auto w-full" />
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">{product.category}</div>
                    <h2 className="mt-2 text-xl font-semibold text-[var(--green-dark)]">{product.name}</h2>
                    <div className="mt-2 text-lg font-semibold text-[var(--green)]">{formatCurrency(price)}</div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
