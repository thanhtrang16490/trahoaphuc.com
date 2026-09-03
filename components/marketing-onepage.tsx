"use client";

import { useState } from "react";
import Link from "next/link";

type TabId = "overview" | "year" | "ninety" | "content" | "rules";

const tabs: Array<{ id: TabId; number: string; label: string; hint: string }> = [
  { id: "overview", number: "01", label: "Tổng quan", hint: "Định vị & phễu" },
  { id: "year", number: "02", label: "Kế hoạch 12 tháng", hint: "Mục tiêu theo quý" },
  { id: "ninety", number: "03", label: "Kế hoạch 90 ngày", hint: "Triển khai theo tuần" },
  { id: "content", number: "04", label: "Content & KPI", hint: "Kênh & đo lường" },
  { id: "rules", number: "05", label: "Nguyên tắc", hint: "Chuẩn thương hiệu" },
];

const products = [
  "Trà Dưỡng Tâm An Nhiên",
  "Trà Thanh Nhiệt Hòa Phúc",
  "Trà Gạo Lứt Lá Sen Hòa Phúc",
  "Trà Bát Bảo Cúc Phương",
  "Trà Thanh Nhiệt Mát Gan",
  "Trà Gạo Lứt Lá Sen Hòa Phúc - Túi",
  "Trà Dưỡng Tâm An Nhiên - Túi",
  "Thảo dược ngâm chân",
  "Mật ong Hòa Phúc",
];

const quarters = [
  {
    label: "Q1",
    title: "Chuẩn hóa nền tảng",
    copy: "Đồng bộ catalog, giá, ảnh, mô tả, nhận diện, tracking và gian hàng Shopee.",
  },
  {
    label: "Q2",
    title: "Kiểm chứng chuyển đổi",
    copy: "Test video, quà biếu, dùng hằng ngày; thu review thật và tối ưu trang sản phẩm.",
  },
  {
    label: "Q3",
    title: "Mở rộng & mua lại",
    copy: "Phân nhóm khách, chăm sóc sau mua, phát triển affiliate và cụm SEO.",
  },
  {
    label: "Q4",
    title: "Mùa quà biếu",
    copy: "Tập trung combo, remarketing, đại lý và đánh giá theo lợi nhuận.",
  },
];

const ninetyDayPhases = [
  {
    label: "Ngày 1-30",
    title: "Chuẩn hóa",
    items: ["Đối chiếu 9 sản phẩm, giá, ảnh và tồn kho.", "Hoàn thiện template ảnh/video và FAQ.", "Thiết lập UTM, analytics và bảng theo dõi.", "Xuất bản nội dung đầu tiên để lấy baseline."],
  },
  {
    label: "Ngày 31-60",
    title: "Kiểm chứng",
    items: ["Đăng 3-5 nội dung mỗi tuần theo phễu.", "Test dùng hằng ngày, quà biếu và chọn trà.", "Thu review thật và thử 1-2 buổi live/tuần.", "Đánh giá nội dung bằng click, lead và đơn."],
  },
  {
    label: "Ngày 61-90",
    title: "Tối ưu",
    items: ["Dồn nguồn lực vào chủ đề có tín hiệu tốt.", "Tạo chuỗi sau mua và gợi ý mua lại.", "Tối ưu combo theo AOV và biên lợi nhuận.", "Quyết định giữ, thử lại hoặc dừng từng kênh."],
  },
];

const kpis = [
  ["CTR", "Click / lượt hiển thị", "Đánh giá sức hút của creative"],
  ["CVR", "Đơn / phiên hoặc click", "Đánh giá chất lượng trang đích"],
  ["CPA", "Chi phí quảng cáo / đơn", "Theo dõi hiệu quả trả phí"],
  ["ROAS", "Doanh thu quy đổi / chi phí", "Quyết định scale ngân sách"],
  ["AOV", "Doanh thu / số đơn", "Tối ưu combo và giá trị giỏ"],
  ["Repeat rate", "Khách mua lại / tổng khách", "Đánh giá sức khỏe tệp khách"],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow text-[11px] md:text-xs">
      <span className="h-px w-8 bg-[var(--green)]" />
      {children}
    </div>
  );
}

function PanelTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 section-title text-[clamp(2.2rem,5vw,4.5rem)]">{title}</h2>
      <p className="mt-5 max-w-[65ch] text-[15px] leading-8 text-[var(--muted)]">{copy}</p>
    </div>
  );
}

export function MarketingOnePage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="container">
      <section className="relative overflow-hidden rounded-[34px] bg-[var(--green-dark)] px-6 py-9 text-white shadow-[0_24px_60px_rgba(6,59,39,0.16)] md:px-12 md:py-14">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute bottom-[-9rem] right-24 h-64 w-64 rounded-full bg-[rgba(159,210,15,0.12)] blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <div className="eyebrow text-[11px] text-white/65 md:text-xs">
            <span className="h-px w-8 bg-[var(--gold)]" />
            Marketing command center
          </div>
          <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(3rem,7vw,6.8rem)] leading-[0.92] tracking-[-0.06em]">
            Hòa Phúc, kể đúng chuyện và bán đúng cách.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[15px] leading-8 text-white/72 md:text-lg md:leading-9">
            Bảng điều hành nội dung và tăng trưởng dựa trên website hiện tại: 9 sản phẩm, 3 nhóm danh mục, điểm bán Shopee và các luồng mua hàng trực tiếp.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Cúc Phương · Ninh Bình</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">9 sản phẩm</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">3 nhóm sản phẩm</span>
          </div>
        </div>
      </section>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <aside className="lg:sticky lg:top-28">
          <div className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Tài liệu marketing</div>
          <nav aria-label="Các mục tài liệu marketing" role="tablist" className="relative liquid-glass-nav flex gap-2 overflow-x-auto p-2 lg:grid lg:gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="marketing-content"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-[2] flex min-w-[176px] shrink-0 items-center gap-3 rounded-[20px] px-3 py-3 text-left transition-colors lg:min-w-0 ${
                    isActive ? "bg-[var(--green-dark)] text-white shadow-[0_10px_22px_rgba(6,59,39,0.16)]" : "text-[var(--green-dark)] hover:bg-white/70"
                  }`}
                >
                  <span className={`font-display text-xl ${isActive ? "text-[var(--gold)]" : "text-[var(--brown)]"}`}>{tab.number}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-5">{tab.label}</span>
                    <span className={`mt-0.5 block text-[11px] ${isActive ? "text-white/60" : "text-[var(--muted)]"}`}>{tab.hint}</span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-4 hidden rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/45 p-4 text-xs leading-6 text-[var(--muted)] lg:block">
            <div className="font-semibold text-[var(--green-dark)]">Nguồn dữ liệu</div>
            Website Hòa Phúc, catalog trong `data/products.ts`, giá trong `data/pricing.ts` và các tài liệu trong thư mục `marketing/`.
          </div>
        </aside>

        <section id="marketing-content" role="tabpanel" aria-live="polite" aria-label={activeTabData.label} className="min-w-0 rounded-[32px] border border-[rgba(15,77,50,0.12)] bg-[rgba(255,255,255,0.42)] p-5 md:p-8 lg:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(15,77,50,0.12)] pb-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Đang xem</div>
              <div className="mt-1 text-lg font-semibold text-[var(--green-dark)]">{activeTabData.label}</div>
            </div>
            <Link href="/san-pham" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--green)] underline decoration-[rgba(15,77,50,0.25)] underline-offset-4">
              Mở catalog sản phẩm
            </Link>
          </div>

          {activeTab === "overview" ? (
            <div className="space-y-10">
              <PanelTitle eyebrow="01 · Định hướng" title="Một thương hiệu Việt có thể được nhớ bằng một hương vị rõ ràng." copy="Hòa Phúc tập trung vào trà thảo mộc và nông sản Việt khởi nguồn từ Cúc Phương, Ninh Bình; vị dễ gần, thông tin dễ hiểu, diện mạo đủ chỉn chu để dùng hoặc trao tặng." />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Nguồn gốc", "Cúc Phương, Ninh Bình và cảm hứng từ vùng nguyên liệu Việt."],
                  ["Trải nghiệm", "Dễ chọn theo nhu cầu, quy cách và dịp sử dụng."],
                  ["Chuyển đổi", "Website, Shopee, tư vấn, hội viên, đại lý và affiliate."],
                ].map(([title, copy]) => (
                  <article key={title} className="card rounded-[24px] p-5 md:p-6">
                    <h3 className="text-lg font-semibold text-[var(--green-dark)]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{copy}</p>
                  </article>
                ))}
              </div>
              <div>
                <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Phễu tăng trưởng</div>
                <div className="mt-5 grid gap-3 md:grid-cols-5">
                  {["Nhận biết", "Cân nhắc", "Chuyển đổi", "Mua lại", "Giới thiệu"].map((item, index) => (
                    <div key={item} className="rounded-[22px] bg-[#f3ead9] p-4">
                      <div className="font-display text-2xl text-[var(--brown)]">0{index + 1}</div>
                      <div className="mt-3 text-sm font-semibold text-[var(--green-dark)]">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[26px] bg-[rgba(15,77,50,0.06)] p-5 md:p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">Catalog hiện tại</div>
                <div className="mt-4 grid gap-x-6 gap-y-2 text-sm text-[var(--muted)] sm:grid-cols-2">
                  {products.map((product, index) => <div key={product}><span className="mr-2 font-semibold text-[var(--green)]">{String(index + 1).padStart(2, "0")}</span>{product}</div>)}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "year" ? (
            <div className="space-y-10">
              <PanelTitle eyebrow="02 · Tầm nhìn 12 tháng" title="Xây hệ thống tăng trưởng, không chỉ chạy từng chiến dịch." copy="Website là trung tâm thương hiệu; Shopee bắt nhu cầu mua ngay; social tạo tin cậy; hội viên, đại lý và affiliate giúp mở rộng và quay lại." />
              <div className="grid gap-4 sm:grid-cols-2">
                {quarters.map((quarter) => (
                  <article key={quarter.label} className="card rounded-[26px] p-6 md:p-7">
                    <div className="flex items-center justify-between"><span className="font-display text-3xl text-[var(--brown)]">{quarter.label}</span><span className="rounded-full bg-[rgba(15,77,50,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--green)]">Quarter</span></div>
                    <h3 className="mt-7 text-xl font-semibold text-[var(--green-dark)]">{quarter.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{quarter.copy}</p>
                  </article>
                ))}
              </div>
              <div>
                <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Kênh & vai trò</div>
                <div className="mt-5 divide-y divide-[rgba(15,77,50,0.12)] rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/50">
                  {[
                    ["Website", "Trung tâm thông tin, SEO và chuyển đổi trực tiếp."],
                    ["Shopee", "Bắt nhu cầu mua nhanh, review, combo và tìm kiếm."],
                    ["Facebook", "Kể chuyện, giải đáp, inbox và remarketing."],
                    ["Video ngắn", "Mở rộng tiếp cận bằng pha trà, mở hộp và chọn quà."],
                    ["Hội viên/đại lý", "Chăm sóc sau mua, mua lại và mở rộng phân phối."],
                  ].map(([channel, role]) => <div key={channel} className="grid gap-1 px-5 py-4 sm:grid-cols-[150px_1fr] sm:gap-6"><div className="text-sm font-semibold text-[var(--green-dark)]">{channel}</div><div className="text-sm leading-6 text-[var(--muted)]">{role}</div></div>)}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "ninety" ? (
            <div className="space-y-10">
              <PanelTitle eyebrow="03 · Hành động 90 ngày" title="Mỗi giai đoạn có một đầu ra để kiểm tra." copy="90 ngày đầu không scale theo cảm tính. Mỗi tuần phải tạo thêm tài sản, dữ liệu hoặc một quyết định rõ ràng cho kênh marketing." />
              <div className="grid gap-4">
                {ninetyDayPhases.map((phase) => (
                  <article key={phase.label} className="rounded-[26px] border border-[rgba(15,77,50,0.12)] bg-[#f6f1e6] p-6 md:p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-3"><div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">{phase.label}</div><h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--green-dark)]">{phase.title}</h3></div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">{phase.items.map((item) => <div key={item} className="flex gap-3 text-sm leading-7 text-[var(--muted)]"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green)]" aria-hidden="true" />{item}</div>)}</div>
                  </article>
                ))}
              </div>
              <div className="rounded-[26px] bg-[var(--green-dark)] p-6 text-white md:p-8"><div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Tiêu chí sau 90 ngày</div><p className="mt-4 max-w-[60ch] text-lg leading-8 text-white/85">Biết nội dung nào tạo click/tin nhắn, sản phẩm nào được xem và mua, kênh nào đóng góp lợi nhuận, và khách hàng cần gì để quay lại.</p></div>
            </div>
          ) : null}

          {activeTab === "content" ? (
            <div className="space-y-10">
              <PanelTitle eyebrow="04 · Content & KPI" title="Nội dung phải dẫn được người xem đến một hành động." copy="Dùng giọng điệu ấm áp, mộc mạc, rõ ràng; lợi ích trải nghiệm trước, thông tin sản phẩm sau và chỉ một CTA chính cho mỗi nội dung." />
              <div className="grid gap-4 sm:grid-cols-2">
                {["Nguồn gốc & thương hiệu", "Kiến thức sử dụng", "Sản phẩm & quà biếu", "Khách hàng & cộng đồng"].map((pillar, index) => <article key={pillar} className="card rounded-[24px] p-5 md:p-6"><div className="font-display text-2xl text-[var(--brown)]">0{index + 1}</div><h3 className="mt-5 text-lg font-semibold text-[var(--green-dark)]">{pillar}</h3><p className="mt-2 text-sm leading-7 text-[var(--muted)]">{["Cúc Phương, thương hiệu, bao bì và câu chuyện Việt.", "Cách pha, chọn vị, quy cách và bảo quản.", "Mở hộp, cận cảnh, gợi ý theo dịp và combo.", "Review thật, đóng gói, hội viên, đại lý và affiliate."][index]}</p></article>)}
              </div>
              <div>
                <div className="eyebrow text-[11px] md:text-xs"><span className="h-px w-8 bg-[var(--green)]" />Dashboard KPI</div>
                <div className="mt-5 overflow-hidden rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/50">
                  {kpis.map(([name, formula, purpose]) => <div key={name} className="grid gap-1 border-b border-[rgba(15,77,50,0.1)] px-5 py-4 last:border-0 sm:grid-cols-[110px_220px_1fr] sm:items-center sm:gap-4"><div className="font-semibold text-[var(--green-dark)]">{name}</div><div className="font-mono text-xs text-[var(--brown)]">{formula}</div><div className="text-sm leading-6 text-[var(--muted)]">{purpose}</div></div>)}
                </div>
              </div>
              <div className="rounded-[26px] bg-[#f3ead9] p-6"><div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">Quy ước UTM</div><code className="mt-4 block break-all text-xs leading-6 text-[var(--green-dark)]">utm_source=facebook utm_medium=organic utm_campaign=2026q1_qua-bieu utm_content=video-mo-hop-01</code></div>
            </div>
          ) : null}

          {activeTab === "rules" ? (
            <div className="space-y-10">
              <PanelTitle eyebrow="05 · Chuẩn vận hành" title="Nhất quán để thương hiệu đáng tin hơn sau mỗi lần chạm." copy="Đây là checklist dùng trước khi đăng bài, chạy ads, cập nhật sàn hoặc giao tài liệu cho đại lý/affiliate." />
              <div className="grid gap-3">
                {["Tên sản phẩm, ảnh, giá và quy cách phải khớp website.", "Một nội dung chỉ có một mục tiêu và một CTA chính.", "Không dùng claim điều trị, thay thế thuốc hoặc số liệu chưa xác minh.", "Review phải là phản hồi thật và được phép sử dụng.", "Mọi chiến dịch cần URL đích, UTM, ngân sách, người phụ trách và ngày đánh giá.", "Ưu tiên doanh thu thuần, chi phí trên đơn, biên lợi nhuận và mua lại hơn lượt xem đơn lẻ."].map((rule, index) => <div key={rule} className="flex gap-4 rounded-[22px] border border-[rgba(15,77,50,0.12)] bg-white/55 p-5"><span className="font-display text-2xl text-[var(--brown)]">{String(index + 1).padStart(2, "0")}</span><p className="pt-1 text-sm leading-7 text-[var(--muted)]">{rule}</p></div>)}
              </div>
              <div className="grid gap-4 md:grid-cols-2"><Link href="/lien-he" className="button button-primary justify-center">Liên hệ tư vấn</Link><a href="https://shopee.vn/nongsanhoaphuc" target="_blank" rel="noreferrer" className="button button-secondary justify-center">Mở Shopee chính thức</a></div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
