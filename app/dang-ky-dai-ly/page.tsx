import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo";
import { brand } from "@/data/site";
import { AgentLeadForm } from "@/components/agent-lead-form";

export const metadata: Metadata = {
  title: "Đăng ký đại lý",
  description: "Đăng ký trở thành đại lý phân phối sản phẩm Nông Sản Hòa Phúc với chính sách linh hoạt và hỗ trợ đồng hành.",
};

const benefits = [
  {
    title: "Chính sách linh hoạt",
    copy: "Chiết khấu theo sản lượng, khu vực và nhóm sản phẩm để dễ bắt đầu.",
    mark: "01",
  },
  {
    title: "Hỗ trợ bán hàng",
    copy: "Có nội dung, hình ảnh, thông tin sản phẩm và gợi ý trưng bày.",
    mark: "02",
  },
  {
    title: "Sản phẩm dễ triển khai",
    copy: "Danh mục phù hợp bán online, cửa hàng quà tặng và kênh đại lý địa phương.",
    mark: "03",
  },
  {
    title: "Đồng hành sau đăng ký",
    copy: "Có người phụ trách tư vấn, cập nhật chính sách và hỗ trợ ra đơn.",
    mark: "04",
  },
];

const steps = [
  {
    title: "Gửi thông tin",
    copy: "Điền form hoặc nhắn fanpage để chúng tôi nắm nhanh khu vực, kênh bán và nhu cầu.",
    mark: "A",
  },
  {
    title: "Nhận tư vấn",
    copy: "Chúng tôi phản hồi chính sách, danh mục phù hợp và cách bắt đầu theo quy mô của bạn.",
    mark: "B",
  },
  {
    title: "Kích hoạt hợp tác",
    copy: "Sau khi thống nhất, bạn có thể triển khai bán hàng với bộ tài liệu và hỗ trợ cần thiết.",
    mark: "C",
  },
];

const faqs = [
  {
    question: "Ai có thể đăng ký đại lý Hòa Phúc?",
    answer: "Cá nhân, cửa hàng đặc sản, quà biếu, đại lý địa phương hoặc đơn vị bán online đều có thể đăng ký.",
  },
  {
    question: "Tôi chưa có kinh nghiệm bán hàng có thể đăng ký không?",
    answer: "Có. Chúng tôi ưu tiên hỗ trợ những đối tác mới bằng cách gợi ý nhóm sản phẩm dễ bán và kịch bản tư vấn.",
  },
  {
    question: "Bao lâu sẽ được phản hồi?",
    answer: "Thông thường trong giờ làm việc, fanpage hoặc form liên hệ sẽ được phản hồi sớm nhất có thể.",
  },
];

export default function AgentSignupPage() {
  return (
    <main className="pb-[calc(env(safe-area-inset-bottom)+88px)] md:pb-24">
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Đăng ký đại lý", href: "/dang-ky-dai-ly" }]} />
      <FAQJsonLd questions={faqs} />

      <section className="section pt-6 md:pt-12">
        <div className="container grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="space-y-6">
            <div className="eyebrow text-[11px] md:text-xs">
              <span className="h-px w-8 bg-[var(--green)]" />
              Đại lý phân phối
            </div>

            <div className="rounded-[32px] bg-[linear-gradient(180deg,#f8fff0,#e4f4c9)] p-6 shadow-[0_18px_36px_rgba(99,160,0,0.12)] md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <h1 className="text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--green-dark)]">
                    Trở thành đại lý Hòa Phúc và cùng đưa nông sản sạch đến nhiều khách hàng hơn.
                  </h1>
                  <p className="mt-4 max-w-[62ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
                    Hợp tác cùng Nông Sản Hòa Phúc để phân phối các dòng trà thảo mộc, đặc sản vùng miền và quà biếu
                    mang tinh thần hiện đại, phù hợp cho bán lẻ, đại lý địa phương và kênh online.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-[320px] lg:grid-cols-1">
                  <a
                    href={brand.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-primary justify-center"
                  >
                    Nhắn tin fanpage <span className="text-lg leading-none">›</span>
                  </a>
                  <a href={`tel:${brand.phone.replace(/\s+/g, "")}`} className="button button-secondary justify-center">
                    Gọi ngay: {brand.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {benefits.map(({ title, copy, mark }) => (
                <div key={title} className="rounded-[24px] border border-[rgba(15,77,50,0.08)] bg-white/80 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[rgba(15,77,50,0.07)] text-[12px] font-semibold tracking-[0.18em] text-[var(--green)]">
                      {mark}
                    </div>
                    <h2 className="mt-4 text-[16px] font-semibold text-[var(--green-dark)]">{title}</h2>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map(({ title, copy, mark }, index) => (
                <div key={title} className="rounded-[28px] border border-[rgba(15,77,50,0.08)] bg-white p-5 shadow-[0_12px_28px_rgba(15,77,50,0.07)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(15,77,50,0.06)] text-[12px] font-semibold tracking-[0.18em] text-[var(--green)]">
                      {mark}
                    </div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">
                      0{index + 1}
                    </div>
                  </div>
                  <h3 className="mt-4 text-[18px] font-semibold text-[var(--green-dark)]">{title}</h3>
                  <p className="mt-2 text-[14px] leading-7 text-[var(--muted)]">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[32px] bg-white p-5 shadow-[0_20px_40px_rgba(15,77,50,0.1)] md:p-6">
              <div className="eyebrow text-[11px] md:text-xs">
                <span className="h-px w-8 bg-[var(--green)]" />
                Form đăng ký
              </div>
              <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] text-[var(--green-dark)]">
                Gửi thông tin để chúng tôi tư vấn nhanh
              </h2>
              <p className="mt-3 text-[14px] leading-7 text-[var(--muted)]">
                Chỉ cần điền vài thông tin cơ bản, đội ngũ Hòa Phúc sẽ phản hồi chính sách và danh mục phù hợp cho khu vực của bạn.
              </p>

              <AgentLeadForm />
              {/*
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Họ và tên / doanh nghiệp</span>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A hoặc Công ty TNHH..."
                    className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Số điện thoại</span>
                    <input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Khu vực kinh doanh</span>
                    <input
                      type="text"
                      placeholder="Ninh Bình, Hà Nội, online..."
                      className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Loại hình kinh doanh</span>
                    <select className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]">
                      <option>Cửa hàng đặc sản</option>
                      <option>Đại lý phân phối</option>
                      <option>Bán online / livestream</option>
                      <option>Doanh nghiệp quà biếu</option>
                      <option>Cá nhân cộng tác</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Quy mô dự kiến</span>
                    <select className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]">
                      <option>Mới bắt đầu</option>
                      <option>10-30 đơn / tháng</option>
                      <option>30-100 đơn / tháng</option>
                      <option>Trên 100 đơn / tháng</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Nhóm sản phẩm quan tâm</span>
                    <select className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]">
                      <option>Trà thảo mộc</option>
                      <option>Đặc sản vùng miền</option>
                      <option>Quà biếu</option>
                      <option>Tất cả danh mục</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Kênh bán hiện tại</span>
                    <select className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]">
                      <option>Chưa có kênh bán</option>
                      <option>Fanpage / Facebook</option>
                      <option>Cửa hàng offline</option>
                      <option>Sàn TMĐT</option>
                      <option>Kết hợp nhiều kênh</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Bạn cần Hòa Phúc hỗ trợ gì?</span>
                  <textarea
                    rows={4}
                    placeholder="Ví dụ: báo giá, chính sách chiết khấu, bộ ảnh bán hàng, mẫu nội dung đăng bài..."
                    className="w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]"
                  />
                </label>

                <button type="button" className="button button-primary w-full justify-center">
                  Gửi đăng ký đại lý
                </button>

                <p className="text-[12px] leading-6 text-[var(--muted)]">
                  Bằng việc gửi form, bạn đồng ý để Hòa Phúc liên hệ tư vấn qua điện thoại hoặc fanpage.
                </p>
              </form> */}
            </div>

            <div className="mt-4 rounded-[28px] border border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.04)] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brown)]">Thông tin doanh nghiệp</div>
              <div className="mt-3 grid gap-2 text-sm leading-7 text-[var(--muted)]">
                <p>{brand.legalName}</p>
                <p>Mã số thuế: {brand.taxId}</p>
                <p>Địa chỉ: {brand.address}</p>
                <p>Fanpage: Nông Sản Hòa Phúc</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
