import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu thương hiệu Nông Sản Hòa Phúc, định hướng sản phẩm và hệ sinh thái bán hàng.",
};

export default function IntroductionPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Giới thiệu", href: "/gioi-thieu" }]} />
      <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Giới thiệu
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Nông Sản Hòa Phúc</h1>
          <p className="mt-4 max-w-[65ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Nông Sản Hòa Phúc là thương hiệu nông sản sạch từ thiên nhiên, phát triển các dòng trà thảo mộc, mật ong,
            bột sắn dây và tinh bột nghệ với tinh thần mộc mạc nhưng trình bày cao cấp.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Vùng nguyên liệu Việt Nam",
              "Thiết kế bao bì premium",
              "Trải nghiệm mua hàng rõ ràng",
              "Phù hợp web, app và mini app",
            ].map((item) => (
              <div key={item} className="card rounded-[24px] p-4 text-sm font-semibold text-[var(--green-dark)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5 md:p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Định hướng</div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Chúng tôi ưu tiên sự rõ ràng trong thông tin sản phẩm, cảm xúc thương hiệu nhất quán và khả năng mở rộng
              sang các kênh thương mại số trong tương lai.
            </p>
          </div>
        </section>

        <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Hệ sinh thái
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
            Một nền tảng để phát triển website, app và mini app đồng nhất.
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
            Giới thiệu thương hiệu không chỉ là kể về sản phẩm, mà còn là tạo ra một trải nghiệm số có thể đi cùng
            khách hàng ở nhiều nền tảng.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/san-pham" className="button button-primary justify-center">
              Xem sản phẩm
            </Link>
            <Link href="/gioi-thieu/cau-chuyen-thuong-hieu" className="button button-secondary justify-center">
              Câu chuyện thương hiệu
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

