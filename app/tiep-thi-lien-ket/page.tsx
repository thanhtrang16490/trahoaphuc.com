import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: "Tiếp thị liên kết",
  description: "Chương trình tiếp thị liên kết sản phẩm Nông Sản Hòa Phúc.",
};

export default function AffiliatePage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Tiếp thị liên kết", href: "/tiep-thi-lien-ket" }]} />
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Affiliate
            </div>
            <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Tham gia tiếp thị liên kết</h1>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
              Bạn có thể hợp tác giới thiệu sản phẩm Hòa Phúc trên mạng xã hội, website, blog hoặc kênh nội dung cá
              nhân để tạo thêm doanh thu từ mỗi đơn hàng phát sinh.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Dễ bắt đầu, nội dung đẹp và dễ chia sẻ",
                "Phù hợp creator, reviewer, cộng tác viên",
                "Sản phẩm tốt để làm nội dung quà biếu",
                "Có thể mở rộng thành hệ thống đối tác lâu dài",
              ].map((item) => (
                <div key={item} className="card rounded-[24px] p-4 text-sm font-semibold text-[var(--green-dark)]">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5 md:p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Bạn sẽ nhận được</div>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
                <p>Link giới thiệu riêng hoặc cơ chế tracking theo thỏa thuận</p>
                <p>Nội dung, hình ảnh và thông tin sản phẩm chuẩn thương hiệu</p>
                <p>Hỗ trợ cập nhật bộ sản phẩm mới khi ra mắt</p>
                <p>Ưu tiên trao đổi nhanh qua fanpage hoặc Zalo</p>
              </div>
            </div>
          </section>

          <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Bắt đầu
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
              Đăng ký nhanh để nhận thông tin hợp tác.
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
              Gửi thông tin kênh của bạn, chúng tôi sẽ phản hồi về cách hợp tác phù hợp nhất với nội dung và tệp khách
              hàng của bạn.
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
              <a href="/san-pham" className="button button-secondary justify-center">
                Xem sản phẩm
              </a>
            </div>

            <div className="mt-8 rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Gợi ý nội dung tin nhắn</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                “Tôi muốn tham gia tiếp thị liên kết cho Hòa Phúc. Kênh của tôi là..., vui lòng gửi thông tin hợp tác.”
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

