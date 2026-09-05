import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo";
import { brand } from "@/data/site";
import { MembershipMembers } from "@/components/membership-members";

export const metadata: Metadata = {
  title: "Hội viên thân thiết",
  description: "Tham gia hội viên Hòa Phúc để tích điểm, đổi quà, nhận voucher và xem hạng thành viên.",
};

const memberTiers = [
  {
    name: "Thành viên mới",
    points: 0,
    benefits: ["Tích điểm mỗi đơn hàng", "Nhận ưu đãi mở đầu", "Theo dõi lịch sử mua"],
    color: "from-[#f4f8ea] to-[#e7f0c1]",
    mark: "01",
  },
  {
    name: "Hội viên thân thiết",
    points: 1000,
    benefits: ["Đổi voucher nhanh hơn", "Ưu đãi riêng theo mùa", "Hỗ trợ ưu tiên qua fanpage"],
    color: "from-[#def0b1] to-[#bada55]",
    mark: "02",
  },
  {
    name: "Hội viên vàng",
    points: 3000,
    benefits: ["Quà sinh nhật & dịp đặc biệt", "Ưu đãi đổi điểm cao hơn", "Gợi ý combo tiết kiệm"],
    color: "from-[#f7dc7b] to-[#d2a400]",
    mark: "03",
  },
];

const faqs = [
  {
    question: "Điểm hội viên được tính như thế nào?",
    answer: "Điểm hiển thị hiện được tạm tính theo giá trị các đơn đã xác nhận. Quy đổi chính thức sẽ được Hòa Phúc công bố khi chương trình tích điểm vận hành đầy đủ.",
  },
  {
    question: "Làm sao để lên hạng hội viên?",
    answer: "Bạn tích điểm qua đơn hàng, vòng quay may mắn và các hoạt động ưu đãi trên website.",
  },
  {
    question: "Tôi có thể dùng điểm để làm gì?",
    answer: "Điểm có thể đổi voucher, quà tặng hoặc dùng cho các ưu đãi đặc biệt trên trang ưu đãi.",
  },
];

export default function MembershipPage() {
  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Hội viên thân thiết", href: "/dang-ky-thanh-vien" }]} />
      <FAQJsonLd questions={faqs} />

      <section className="section pt-6 md:pt-12">
        <div className="container grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <div className="space-y-6">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Hội viên Hòa Phúc
            </div>

            <div className="rounded-[34px] bg-[linear-gradient(135deg,#12331f,#2f6f2f_58%,#9fd20f)] p-6 text-white shadow-[0_20px_50px_rgba(15,77,50,0.2)] md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/90">
                    ✦
                    Điểm thưởng theo giá trị đơn
                  </div>
                  <h1 className="mt-4 text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
                    Trở thành hội viên để tích điểm, đổi quà và mở khóa ưu đãi riêng.
                  </h1>
                  <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-white/84 md:text-base">
                    Chương trình hội viên Hòa Phúc được thiết kế để khách hàng có thể mua hàng thường xuyên, tích điểm
                    minh bạch và đổi quà nhanh ngay trên website.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-[320px] lg:grid-cols-1">
                  <Link href="/dang-nhap" className="button button-primary justify-center bg-white text-[var(--green-dark)]">
                    Đăng nhập hội viên
                  </Link>
                  <Link href="/ca-nhan" className="button button-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/15">
                    Xem điểm đổi quà
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Tích điểm", value: "Theo giá trị đơn", mark: "★" },
                  { label: "Đổi quà", value: "Voucher & quà tặng", mark: "🎁" },
                  { label: "Ưu tiên", value: "Đặc quyền theo hạng", mark: "◎" },
                ].map(({ label, value, mark }) => (
                  <div key={label} className="rounded-[24px] border border-white/12 bg-white/10 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/12 text-white">
                      <span className="text-[16px] leading-none">{mark}</span>
                    </div>
                    <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/72">{label}</div>
                    <div className="mt-1 text-[16px] font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {memberTiers.map(({ name, points, benefits, color, mark }) => (
                <article key={name} className={`rounded-[28px] bg-gradient-to-br ${color} p-5 shadow-[0_12px_28px_rgba(15,77,50,0.08)]`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/70 text-[var(--green-dark)]">
                      <span className="text-[12px] font-semibold tracking-[0.18em]">{mark}</span>
                    </div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--green-dark)]">
                      {points} điểm
                    </div>
                  </div>
                  <h2 className="mt-4 text-[18px] font-semibold text-[var(--green-dark)]">{name}</h2>
                  <ul className="mt-3 space-y-2 text-[13px] leading-6 text-[var(--green-dark)]/85">
                    {benefits.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-[12px]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[32px] bg-white p-5 shadow-[0_20px_40px_rgba(15,77,50,0.1)] md:p-6">
              <div className="eyebrow text-[11px] md:text-xs">
                <span className="h-px w-8 bg-[var(--green)]" />
                Danh sách hội viên
              </div>
              <MembershipMembers />
            </div>

            <div className="rounded-[28px] border border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.04)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Cách tham gia</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <p>1. Đăng nhập hoặc tạo tài khoản Hòa Phúc.</p>
                <p>2. Mua hàng, quay thưởng hoặc tham gia ưu đãi để tích điểm.</p>
                <p>3. Đổi điểm sang voucher, quà tặng hoặc ưu đãi đặc biệt.</p>
              </div>
              <div className="mt-4">
                <Link href="/dang-nhap" className="button button-primary w-full justify-center">
                  Tham gia hội viên <span className="text-lg leading-none">›</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-[linear-gradient(180deg,#f8fff0,#e4f4c9)] p-5 shadow-[0_12px_28px_rgba(99,160,0,0.12)]">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Thông tin</div>
              <div className="mt-3 grid gap-2 text-sm leading-7 text-[var(--muted)]">
                <p>{brand.legalName}</p>
                <p>MST: {brand.taxId}</p>
                <p>Điểm thưởng tích lũy có thể đổi trực tiếp sang quà hoặc voucher.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
