import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/data/product-utils";
import { products } from "@/data/products";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatCurrency, getProductPrice } from "@/data/pricing";
import { BreadcrumbJsonLd, FAQJsonLd, ProductJsonLd } from "@/components/seo";

const customerReviews = [
  {
    name: "Nguyễn Thị H.",
    location: "Ninh Bình",
    text: "Trà thơm, vị dễ uống, đóng gói đẹp. Mình mua làm quà biếu rất ưng ý.",
    rating: 5,
  },
  {
    name: "Trần Văn T.",
    location: "Hà Nội",
    text: "Giao hàng nhanh, tư vấn rõ ràng. Sản phẩm đúng mô tả, sẽ đặt thêm.",
    rating: 5,
  },
  {
    name: "Lê Thu P.",
    location: "TP.HCM",
    text: "Mùi trà nhẹ, uống buổi tối rất dễ chịu. Card sản phẩm nhìn sang, thích hợp bán quà tặng.",
    rating: 5,
  },
];

const productFaqs = [
  {
    question: "Sản phẩm Hòa Phúc phù hợp dùng khi nào?",
    answer:
      "Các dòng trà Hòa Phúc phù hợp dùng trong ngày, đặc biệt là buổi sáng hoặc buổi chiều khi muốn có một khoảng thư giãn nhẹ và hương vị dễ chịu.",
  },
  {
    question: "Có giao hàng toàn quốc không?",
    answer:
      "Có. Hòa Phúc hỗ trợ giao hàng toàn quốc, đóng gói cẩn thận và theo dõi đơn hàng theo từng khu vực giao nhận.",
  },
  {
    question: "Tôi có thể mua làm quà biếu không?",
    answer:
      "Hoàn toàn phù hợp. Thiết kế hộp kraft, câu chuyện vùng nguyên liệu và quy cách túi lọc giúp sản phẩm dễ dùng làm quà biếu, quà tặng doanh nghiệp hoặc cá nhân.",
  },
];

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
      title: product.name,
      description: `${product.shortDescription} ${product.packageLabel}. ${product.origin}.`,
      alternates: {
        canonical: `/san-pham/${product.slug}`,
      },
      openGraph: {
        title: product.name,
        description: `${product.shortDescription} ${product.packageLabel}. ${product.origin}.`,
        images: [{ url: product.image, alt: product.name }],
        url: `https://hoaphucfarm.com/san-pham/${product.slug}`,
      },
    };
  }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);
  const price = getProductPrice(product.slug);

  return (
    <main className="section !pt-0 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Sản phẩm", href: "/san-pham" },
          { name: product.name, href: `/san-pham/${product.slug}` },
        ]}
      />
      <ProductJsonLd product={product} price={price} url={`https://hoaphucfarm.com/san-pham/${product.slug}`} />
      <FAQJsonLd questions={productFaqs} />
      <div className="container">
        <div className="md:hidden">
          <div className="-mx-4 sticky top-0 z-40 border-b border-[rgba(15,77,50,0.08)] bg-[rgba(255,255,255,0.92)]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link
                href="/san-pham"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)] shadow-[0_10px_18px_rgba(15,77,50,0.08)]"
                aria-label="Quay lại danh sách sản phẩm"
              >
                <span className="text-[18px] leading-none">‹</span>
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Sản phẩm</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">{product.name}</div>
              </div>
            </div>
          </div>

          <div className="-mx-4 overflow-hidden bg-white">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={product.imageWidth}
                height={product.imageHeight}
                className="h-auto w-full"
                priority
              />
              <div className="absolute left-0 top-0 flex w-full items-start justify-between px-3 pt-3">
                <span className="rounded-full bg-[rgba(255,255,255,0.88)] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-[var(--green-dark)] shadow-[0_8px_18px_rgba(15,77,50,0.12)]">
                  {product.category}
                </span>
                <span className="rounded-full bg-[var(--green)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_22px_rgba(15,77,50,0.18)]">
                  Sản phẩm yêu thích
                </span>
              </div>
            </div>

            <div className="px-4 pt-5">
              <h1 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--green-dark)]">
                {product.name}
              </h1>
              <div className="mt-3 text-[30px] font-semibold leading-none text-[var(--green)]">{formatCurrency(price)}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-[4px] border border-[var(--green)] px-3 py-1 text-[12px] font-semibold text-[var(--green)]">
                  Tích điểm đổi quà
                </span>
                <span className="rounded-[4px] border border-[var(--green)] px-3 py-1 text-[12px] font-semibold text-[var(--green)]">
                  Freeship đơn từ 200k
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[13px] text-[var(--green-dark)]">
                <span className="text-[18px] leading-none text-[#ffcc00]">★ ★ ★ ★ ★</span>
                <span className="h-5 w-px bg-[rgba(15,77,50,0.2)]" />
                <span>315 đã bán</span>
              </div>
            </div>

            <div className="border-t border-[rgba(15,77,50,0.08)] px-4 py-5">
              <div className="text-[16px] leading-7 text-[var(--muted)]">{product.longDescription}</div>

              <div className="mt-5 text-[16px] font-semibold text-[var(--green-dark)]">{product.name} – Hòa Phúc</div>
              <div className="mt-3 text-[16px] leading-8 text-[var(--muted)]">
                <strong className="font-semibold text-[var(--green-dark)]">Thành phần:</strong>{" "}
                {product.ingredients.join("; ")}.
              </div>

              <div className="mt-5 rounded-[18px] bg-[rgba(15,77,50,0.05)] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Điểm nổi bật</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.benefits.map((item) => (
                    <span
                      key={item}
                      className="rounded-[4px] border border-[rgba(15,77,50,0.14)] bg-white px-3 py-1 text-[12px] font-semibold text-[var(--green-dark)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Đóng gói kỹ", copy: "Giữ sản phẩm sạch đẹp khi giao đến tay khách." },
                  { title: "Hỗ trợ tư vấn", copy: "Tư vấn nhanh qua fanpage hoặc hotline." },
                  { title: "Phù hợp quà biếu", copy: "Bao bì kraft sang, dễ tặng dịp lễ Tết." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[16px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_10px_22px_rgba(15,77,50,0.06)]">
                    <div className="text-sm font-semibold text-[var(--green-dark)]">{item.title}</div>
                    <div className="mt-1 text-xs leading-6 text-[var(--muted)]">{item.copy}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[18px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_12px_28px_rgba(15,77,50,0.08)]">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Đánh giá</div>
                    <div className="mt-1 text-[18px] font-semibold text-[var(--green-dark)]">Khách hàng đã mua</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-semibold text-[var(--green)]">4.9/5</div>
                    <div className="text-xs text-[var(--muted)]">Từ 128 lượt mua</div>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {customerReviews.map((review) => (
                    <div key={`${review.name}-${review.location}`} className="rounded-[16px] bg-[rgba(15,77,50,0.04)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[var(--green-dark)]">{review.name}</div>
                          <div className="text-xs text-[var(--muted)]">{review.location}</div>
                        </div>
                        <div className="text-sm font-semibold text-[#ffcc00]">
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[18px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_12px_28px_rgba(15,77,50,0.06)]">
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Câu hỏi thường gặp</div>
                <div className="mt-4 space-y-3">
                  {productFaqs.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-[16px] border border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.03)] p-4"
                    >
                      <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--green-dark)]">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/san-pham" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)]">
            Tất cả sản phẩm
          </Link>
          <Link href="/muc-san-pham" className="text-sm font-semibold text-[var(--muted)] underline decoration-[rgba(15,77,50,0.18)] underline-offset-4">
            Xem theo nhóm
          </Link>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="grid gap-4">
            <div className="panel overflow-hidden rounded-[30px] md:rounded-[36px]">
              <Image
                src={product.image}
                alt={product.name}
                width={product.imageWidth}
                height={product.imageHeight}
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel overflow-hidden rounded-[26px]">
                <Image
                  src={product.boxImage}
                  alt={`${product.name} - ảnh hộp`}
                  width={product.boxImageWidth}
                  height={product.boxImageHeight}
                  className="h-auto w-full"
                />
              </div>
              <div className="card rounded-[26px] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brown)]">Thông tin nhanh</div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                  <div>
                    <div className="font-semibold text-[var(--green-dark)]">Danh mục</div>
                    <div>{product.category}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--green-dark)]">Quy cách</div>
                    <div>{product.packageLabel}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--green-dark)]">Xuất xứ</div>
                    <div>{product.origin}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="eyebrow">
              <span className="h-px w-8 bg-[var(--green)]" />
              {product.category}
            </div>
            <h1 className="mt-5 section-title">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="text-2xl font-semibold text-[var(--green-dark)] md:text-3xl">{formatCurrency(price)}</div>
              <span className="rounded-full bg-[var(--green)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Hàng local
              </span>
              <span className="rounded-full border border-[rgba(15,77,50,0.12)] bg-white/60 px-3 py-1 text-[11px] font-semibold text-[var(--green-dark)]">
                {product.packageLabel}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { title: "Hỗ trợ nhanh", copy: "Nhắn fanpage hoặc Zalo để chốt đơn." },
                { title: "Giao hàng", copy: "Xử lý đơn nhanh theo khu vực hỗ trợ." },
                { title: "Mua an tâm", copy: "Thông tin doanh nghiệp và chính sách rõ ràng." },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-4">
                  <div className="text-sm font-semibold text-[var(--green-dark)]">{item.title}</div>
                  <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{item.copy}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[60ch] text-base leading-8 text-[var(--muted)]">{product.longDescription}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {product.benefits.map((item) => (
                <div key={item} className="card rounded-[24px] p-4 text-sm font-semibold text-[var(--green-dark)]">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Thành phần nổi bật</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.ingredients.map((item) => (
                  <span key={item} className="pill border border-[rgba(15,77,50,0.12)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--green)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 rounded-[28px] border border-[rgba(15,77,50,0.08)] bg-white p-5 shadow-[0_12px_28px_rgba(15,77,50,0.08)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Đánh giá</div>
                  <div className="mt-1 text-2xl font-semibold text-[var(--green-dark)]">Khách hàng đã mua</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-[var(--green)]">4.9/5</div>
                  <div className="text-sm text-[var(--muted)]">Từ 128 lượt mua</div>
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                {customerReviews.map((review) => (
                  <div key={`${review.name}-${review.location}`} className="rounded-[20px] bg-[rgba(15,77,50,0.04)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[var(--green-dark)]">{review.name}</div>
                        <div className="text-xs text-[var(--muted)]">{review.location}</div>
                      </div>
                      <div className="text-sm font-semibold text-[#ffcc00]">{"★".repeat(review.rating)}</div>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <AddToCartButton slug={product.slug} />
              <Link href="/gio-hang" className="button button-secondary hidden md:inline-flex">
                Mua ngay
              </Link>
            </div>
            <div className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {product.packageLabel} • {product.origin}
            </div>
            <div className="mt-6 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Gợi ý chốt đơn</div>
              <div className="mt-3 text-sm leading-7 text-[var(--green-dark)]">
                Khách thường mua theo combo quà biếu hoặc thêm 2-3 sản phẩm cùng nhóm để dễ đạt ngưỡng freeship nội bộ
                khi có chương trình.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-40 px-4">
            <div className="mx-auto flex max-w-screen-sm gap-3 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(248,243,233,0.96)] p-3 backdrop-blur-xl">
              <Link href="/gio-hang" className="button button-secondary flex-1 justify-center text-sm">
                Xem giỏ hàng
              </Link>
              <div className="flex-1">
                <AddToCartButton slug={product.slug} />
              </div>
            </div>
          </div>
        </div>

        <section className="section px-0 pb-0">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow">
                <span className="h-px w-8 bg-[var(--green)]" />
                Sản phẩm liên quan
              </div>
              <h2 className="mt-5 section-title">Mở rộng bộ sưu tập Hòa Phúc</h2>
            </div>
            <Link href="/san-pham" className="button button-secondary hidden md:inline-flex">
              Xem toàn bộ
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/san-pham/${item.slug}`} className="card rounded-[28px] p-5 transition-transform duration-300 hover:-translate-y-1">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  className="h-auto w-full rounded-[22px]"
                />
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">{item.category}</div>
                <h3 className="mt-3 text-xl font-semibold text-[var(--green-dark)]">{item.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="section px-0 pb-0">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Cách dùng gợi ý",
                copy: "Pha với nước nóng theo hướng dẫn trên bao bì, điều chỉnh độ đậm nhạt theo khẩu vị.",
              },
              {
                title: "Phù hợp làm quà",
                copy: "Thiết kế hộp kraft sang trọng, dễ trưng bày và phù hợp tặng biếu dịp lễ Tết.",
              },
              {
                title: "Đặt hàng nhanh",
                copy: "Thêm vào giỏ trên website hoặc chuyển ngay sang giỏ hàng để hoàn tất đơn hàng.",
              },
            ].map((item) => (
              <div key={item.title} className="card rounded-[28px] p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">{item.title}</div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}
