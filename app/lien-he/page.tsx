import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";

export default function ContactPage() {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Liên hệ", href: "/lien-he" }]} />
      <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Liên hệ
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Kết nối với Nông Sản Hòa Phúc</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Fanpage và website được đồng bộ theo cùng một hệ nhận diện để bạn có thể đặt hàng, hỏi nhanh hoặc theo dõi
            câu chuyện sản phẩm trên mọi nền tảng.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a className="button button-primary justify-center" href="https://www.facebook.com/nongsanhoaphucnb/" target="_blank" rel="noreferrer">
              Fanpage Facebook
            </a>
            <a className="button button-secondary justify-center" href="tel:+84366697135">
              Gọi ngay
            </a>
            <a className="button button-secondary justify-center" href="https://zalo.me/84366697135" target="_blank" rel="noreferrer">
              Chat Zalo
            </a>
            <a className="button button-secondary justify-center" href="/#san-pham-noi-bat">
              Xem sản phẩm
            </a>
          </div>

          <div className="mt-8 space-y-4 rounded-[28px] border border-[rgba(15,77,50,0.12)] bg-white/60 p-5">
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Công ty</div>
              <div className="text-sm leading-7 text-[var(--muted)]">CÔNG TY TNHH NÔNG SẢN HOÀ PHÚC</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Mã số thuế</div>
              <div className="text-sm leading-7 text-[var(--muted)]">2700963962</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Địa chỉ</div>
              <div className="text-sm leading-7 text-[var(--muted)]">Ngã 3, thôn Nga 2, Xã Cúc Phương, Huyện Nho quan, Tỉnh Ninh Bình, Việt Nam.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Địa chỉ thuế</div>
              <div className="text-sm leading-7 text-[var(--muted)]">Ngã 3, thôn Nga 2, Xã Cúc Phương, Tỉnh Ninh Bình, Việt Nam.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Hotline / Zalo</div>
              <div className="text-sm leading-7 text-[var(--muted)]">+84 36 669 7135</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Fanpage chính thức</div>
              <div className="text-sm leading-7 text-[var(--muted)]">Nông Sản Hòa Phúc | Nho Quan</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--green-dark)]">Người đại diện</div>
              <div className="text-sm leading-7 text-[var(--muted)]">VŨ HUYỀN TRANG</div>
            </div>
          </div>
        </section>

        <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Social commerce
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
            Dùng một hệ nhận diện cho web, app và mini app sau này.
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
            Trang liên hệ này được thiết kế để trở thành điểm chạm chuyển đổi chính, phù hợp để gắn QR trên bao bì, post
            mạng xã hội và các kênh bán hàng sau này.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Chốt đơn qua fanpage",
              "Nhắn Zalo để được tư vấn nhanh",
              "Mua trực tiếp từ website",
              "Mở rộng sang app và mini app sau này",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/55 px-4 py-4 text-sm font-semibold text-[var(--green-dark)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.06)] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Mô tả ngắn</div>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Nông sản sạch từ thiên nhiên. Trà thảo mộc, mật ong, bột sắn dây và tinh bột nghệ từ vùng nguyên liệu
              Việt Nam.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
