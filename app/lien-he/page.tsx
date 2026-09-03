import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { brand } from "@/data/site";

const phoneHref = `tel:${brand.phone.replace(/\s+/g, "")}`;
const zaloHref = "https://zalo.me/84366697135";
const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`;

export const metadata: Metadata = {
  title: "Liên hệ Hòa Phúc",
  description: "Liên hệ Nông Sản Hòa Phúc để được tư vấn trà thảo mộc, quà biếu, sản phẩm nông sản và đăng ký đại lý.",
  alternates: { canonical: "/lien-he" },
  openGraph: {
    title: "Liên hệ Hòa Phúc | Trà thảo mộc và quà biếu",
    description: "Gọi, nhắn Zalo, Fanpage hoặc mua trực tiếp từ kênh chính thức của Nông Sản Hòa Phúc.",
    url: "https://hoaphucfarm.com/lien-he",
  },
};

const contactChannels = [
  { label: "Gọi trực tiếp", value: brand.phone, href: phoneHref, kind: "Gọi ngay", primary: true },
  { label: "Chat Zalo", value: "Tư vấn nhanh qua Zalo", href: zaloHref, kind: "Mở Zalo" },
  { label: "Fanpage", value: "Nông Sản Hòa Phúc | Nho Quan", href: brand.facebook, kind: "Nhắn tin" },
  { label: "Gian hàng Shopee", value: "Mua hàng online chính thức", href: brand.shopee, kind: "Mở Shopee" },
];

const intents = [
  { number: "01", title: "Chọn trà dùng hằng ngày", copy: "Xem các dòng trà thảo mộc, dưỡng sinh và quy cách phù hợp.", href: "/san-pham", cta: "Xem sản phẩm" },
  { number: "02", title: "Tìm quà biếu chỉn chu", copy: "Khám phá trà hộp, đặc sản vùng miền và các lựa chọn dễ trao tặng.", href: "/san-pham/tra-bat-bao-cuc-phuong", cta: "Xem gợi ý quà" },
  { number: "03", title: "Đăng ký đại lý", copy: "Gửi thông tin khu vực và kênh bán để nhận tư vấn danh mục phù hợp.", href: "/dang-ky-dai-ly", cta: "Đăng ký hợp tác" },
  { number: "04", title: "Tham gia affiliate", copy: "Nhận thông tin chương trình và cách giới thiệu sản phẩm đúng chuẩn.", href: "/tiep-thi-lien-ket", cta: "Tìm hiểu thêm" },
];

const prepareItems = [
  ["Bạn đang quan tâm sản phẩm nào?", "Tên trà, mật ong, ngâm chân hoặc nhóm sản phẩm."],
  ["Bạn cần dùng hay tặng?", "Mục đích giúp Hòa Phúc gợi ý vị và quy cách phù hợp hơn."],
  ["Bạn nhận hàng ở đâu?", "Khu vực giao hàng giúp đội ngũ tư vấn thuận tiện hơn."],
];

export default function ContactPage() {
  return (
    <main className="overflow-hidden pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Liên hệ", href: "/lien-he" }]} />

      <section aria-labelledby="contact-title" className="section pt-10 md:pt-16 lg:pt-20">
        <div className="container grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Kết nối cùng Hòa Phúc</div>
            <h1 id="contact-title" className="mt-5 max-w-[11ch] section-title text-[clamp(3rem,7vw,6.5rem)]">Bạn cần chọn trà hay một món quà?</h1>
            <p className="mt-6 max-w-[57ch] text-[15px] leading-8 text-[var(--muted)] md:text-lg md:leading-9">
              Gọi hoặc nhắn cho Hòa Phúc để được tư vấn theo nhu cầu. Bạn cũng có thể xem catalog, mua trên Shopee hoặc đăng ký trở thành đại lý ngay từ các kênh chính thức.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green-dark)]">
              <span className="rounded-full border border-[rgba(15,77,50,0.14)] bg-white/55 px-3 py-2">Cúc Phương · Ninh Bình</span>
              <span className="rounded-full border border-[rgba(15,77,50,0.14)] bg-white/55 px-3 py-2">Tư vấn sản phẩm</span>
              <span className="rounded-full border border-[rgba(15,77,50,0.14)] bg-white/55 px-3 py-2">Mua online</span>
            </div>
          </div>

          <div className="rounded-[34px] bg-[var(--green-dark)] p-5 text-white shadow-[0_24px_60px_rgba(6,59,39,0.16)] md:p-7">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Liên hệ nhanh nhất</div>
            <a href={phoneHref} className="mt-4 block font-display text-4xl tracking-[-0.04em] text-white md:text-5xl">{brand.phone}</a>
            <p className="mt-3 max-w-[38ch] text-sm leading-7 text-white/70">Một cuộc gọi giúp đội ngũ Hòa Phúc hiểu nhanh nhu cầu và hướng bạn tới lựa chọn phù hợp.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href={phoneHref} className="button justify-center bg-white text-[var(--green-dark)] hover:bg-[#f3ead9]">Gọi ngay</a>
              <a href={zaloHref} target="_blank" rel="noreferrer" className="button justify-center border border-white/25 text-white hover:bg-white/10">Chat Zalo</a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="channels-title" className="section pt-0 md:pt-4">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Kênh chính thức</div>
              <h2 id="channels-title" className="mt-4 section-title text-[clamp(2rem,4vw,4rem)]">Chọn cách bạn muốn kết nối.</h2>
            </div>
            <div className="text-sm text-[var(--muted)]">Phản hồi theo kênh bạn thuận tiện nhất.</div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contactChannels.map((channel) => (
              <a key={channel.label} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noreferrer" : undefined} className={`group rounded-[26px] border p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6 ${channel.primary ? "border-[var(--green)] bg-[var(--green)] text-white" : "border-[rgba(15,77,50,0.12)] bg-white/55 text-[var(--green-dark)]"}`}>
                <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${channel.primary ? "text-white/60" : "text-[var(--brown)]"}`}>{channel.label}</div>
                <div className="mt-6 min-h-[3.5rem] text-lg font-semibold leading-6">{channel.value}</div>
                <div className={`mt-5 text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4 ${channel.primary ? "text-white" : "text-[var(--green)]"}`}>{channel.kind} <span aria-hidden="true">→</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="intent-title" className="section pt-16 md:pt-24">
        <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Bạn đang cần gì?</div>
            <h2 id="intent-title" className="mt-4 section-title text-[clamp(2.25rem,5vw,4.5rem)]">Đi thẳng đến điều bạn quan tâm.</h2>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-8 text-[var(--muted)]">Không cần tìm trong nhiều trang. Chọn đúng nhu cầu, Hòa Phúc đã chuẩn bị sẵn điểm bắt đầu cho bạn.</p>
          </div>
          <div className="grid gap-3">
            {intents.map((intent) => (
              <Link key={intent.number} href={intent.href} className="group grid gap-4 rounded-[26px] border border-[rgba(15,77,50,0.12)] bg-[#f6f1e6] p-5 transition-colors duration-300 hover:border-[rgba(15,77,50,0.3)] sm:grid-cols-[64px_1fr_auto] sm:items-center md:p-7">
                <span className="font-display text-3xl text-[var(--brown)]">{intent.number}</span>
                <span><span className="block text-xl font-semibold tracking-[-0.02em] text-[var(--green-dark)]">{intent.title}</span><span className="mt-2 block max-w-[55ch] text-sm leading-7 text-[var(--muted)]">{intent.copy}</span></span>
                <span className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)] underline underline-offset-4">{intent.cta} <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="company-title" className="section pt-16 md:pt-24">
        <div className="container grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="card rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Thông tin doanh nghiệp</div>
            <h2 id="company-title" className="mt-4 section-title text-[clamp(2rem,4vw,4rem)]">Một địa chỉ rõ ràng để bạn an tâm kết nối.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div><div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brown)]">Công ty</div><div className="mt-2 text-sm font-semibold leading-7 text-[var(--green-dark)]">{brand.legalName}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brown)]">Mã số thuế</div><div className="mt-2 text-sm font-semibold leading-7 text-[var(--green-dark)]">{brand.taxId}</div></div>
              <div className="sm:col-span-2"><div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brown)]">Địa chỉ</div><div className="mt-2 text-sm leading-7 text-[var(--muted)]">{brand.address}</div><a href={mapHref} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--green)] underline underline-offset-4">Mở bản đồ <span aria-hidden="true">→</span></a></div>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#f3ead9] p-6 md:p-8 lg:p-10">
            <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Để được tư vấn nhanh hơn</div>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--green-dark)] md:text-4xl">Bạn chỉ cần chuẩn bị ba thông tin.</h2>
            <div className="mt-7 space-y-5">
              {prepareItems.map(([title, copy], index) => <div key={title} className="flex gap-4"><span className="font-display text-xl text-[var(--brown)]">0{index + 1}</span><div><div className="text-sm font-semibold text-[var(--green-dark)]">{title}</div><div className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy}</div></div></div>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
