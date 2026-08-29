import { BreadcrumbJsonLd } from "@/components/seo";
import Link from "next/link";

type Section = {
  title: string;
  content: string[];
};

export function PolicyPage({
  title,
  intro,
  slug,
  sections,
}: {
  title: string;
  intro: string;
  slug: string;
  sections: Section[];
}) {
  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", href: "/" },
          { name: title, href: `/${slug}` },
        ]}
      />
      <div className="container">
        <div className="max-w-4xl">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Chính sách
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">{title}</h1>
          <p className="mt-4 max-w-[70ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">{intro}</p>
        </div>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="card rounded-[28px] p-6 md:p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--green-dark)]">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)] md:text-base md:leading-8">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] bg-[rgba(15,77,50,0.06)] p-6 md:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brown)]">Cần hỗ trợ?</div>
          <p className="mt-3 max-w-[60ch] text-sm leading-7 text-[var(--muted)]">
            Nếu bạn cần giải đáp thêm về đơn hàng, vận chuyển hoặc đổi trả, vui lòng vào trang liên hệ hoặc quay lại
            trang sản phẩm.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/lien-he" className="button button-primary justify-center">
              Trang liên hệ
            </Link>
            <Link href="/san-pham" className="button button-secondary justify-center">
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

