import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: "Câu chuyện thương hiệu",
  description: "Câu chuyện hình thành và định hướng phát triển thương hiệu Nông Sản Hòa Phúc.",
};

export default function BrandStoryPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Giới thiệu", href: "/gioi-thieu" },
          { name: "Câu chuyện thương hiệu", href: "/gioi-thieu/cau-chuyen-thuong-hieu" },
        ]}
      />
      <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Câu chuyện
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Từ vùng đất lành đến trải nghiệm hiện đại</h1>
          <p className="mt-4 max-w-[65ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Hòa Phúc được xây dựng từ tinh thần trân trọng nông sản Việt và cảm hứng về một trải nghiệm mua hàng chỉn
            chu, tin cậy. Mỗi sản phẩm là một câu chuyện nhỏ về vùng nguyên liệu, vị trà và cách thương hiệu được
            trình bày.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Cảm hứng từ thiên nhiên và vùng miền",
              "Phát triển nhận diện cao cấp, rõ ràng",
              "Tối ưu cho kênh thương mại số",
              "Đồng bộ từ fanpage tới website",
            ].map((item) => (
              <div key={item} className="card rounded-[24px] p-4 text-sm font-semibold text-[var(--green-dark)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5 md:p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Mục tiêu dài hạn</div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Xây dựng một thương hiệu nông sản Việt có bản sắc riêng, đủ đẹp để làm quà biếu, đủ rõ để bán hàng online
              và đủ linh hoạt để mở rộng sang ứng dụng di động trong tương lai.
            </p>
          </div>
        </section>

        <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Kết nối
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
            Cùng đồng hành với thương hiệu trong giai đoạn mở rộng.
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
            Câu chuyện thương hiệu là nền tảng để khách hàng nhớ lâu hơn về sản phẩm, chứ không chỉ xem như một trang
            giới thiệu ngắn.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/dang-ky-dai-ly" className="button button-primary justify-center">
              Đăng ký đại lý
            </Link>
            <Link href="/tiep-thi-lien-ket" className="button button-secondary justify-center">
              Tiếp thị liên kết
            </Link>
            <Link href="/lien-he" className="button button-secondary justify-center">
              Liên hệ ngay
            </Link>
          </div>

          <div className="mt-8 rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Fanpage chính thức</div>
            <a
              href="https://www.facebook.com/nongsanhoaphucnb/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-semibold text-[var(--green-dark)] underline decoration-[rgba(15,77,50,0.22)] underline-offset-4"
            >
              Nông Sản Hòa Phúc | Nho Quan
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}

