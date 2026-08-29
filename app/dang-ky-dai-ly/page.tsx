import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: "Đăng ký đại lý",
  description: "Đăng ký trở thành đại lý phân phối sản phẩm Nông Sản Hòa Phúc.",
};

export default function AgentSignupPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Đăng ký đại lý", href: "/dang-ky-dai-ly" }]} />
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Đại lý
            </div>
            <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Đăng ký đại lý phân phối</h1>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
              Nông Sản Hòa Phúc đang mở rộng hệ thống đại lý và nhà phân phối cho các dòng trà thảo mộc, nông sản và
              sản phẩm quà biếu từ vùng nguyên liệu Việt Nam.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Chiết khấu theo sản lượng và khu vực",
                "Hỗ trợ hình ảnh, nội dung và landing page",
                "Sản phẩm phù hợp bán online lẫn cửa hàng",
                "Đồng bộ thương hiệu với fanpage và website",
              ].map((item) => (
                <div key={item} className="card rounded-[24px] p-4 text-sm font-semibold text-[var(--green-dark)]">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5 md:p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Thông tin cần có</div>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
                <p>Tên cá nhân hoặc doanh nghiệp</p>
                <p>Khu vực kinh doanh và kênh bán chính</p>
                <p>Số điện thoại, fanpage hoặc website đang vận hành</p>
                <p>Danh mục sản phẩm bạn quan tâm</p>
              </div>
            </div>
          </section>

          <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Liên hệ ngay
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
              Chúng tôi sẵn sàng trao đổi chính sách đại lý phù hợp.
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
              Hãy gửi thông tin của bạn qua fanpage hoặc trang liên hệ để chúng tôi phản hồi sớm nhất.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="https://www.facebook.com/nongsanhoaphucnb/"
                target="_blank"
                rel="noreferrer"
                className="button button-primary justify-center"
              >
                Nhắn tin fanpage
              </a>
              <a href="/lien-he" className="button button-secondary justify-center">
                Trang liên hệ
              </a>
              <a href="tel:+84366697135" className="button button-secondary justify-center">
                Gọi ngay: +84 36 669 7135
              </a>
            </div>

            <div className="mt-8 rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Gợi ý nội dung tin nhắn</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                “Tôi muốn đăng ký làm đại lý Hòa Phúc, khu vực..., vui lòng tư vấn chính sách và danh mục phù hợp.”
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

