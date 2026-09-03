"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { useMobileScrollVisibility } from "@/components/use-mobile-scroll-visibility";

type MobileBackHeaderProps = {
  href: string;
  section: string;
  title: string;
};

export function MobileBackHeader({ href, section, title }: MobileBackHeaderProps) {
  const { hidden } = useMobileScrollVisibility();

  return (
    <section className="md:hidden">
      <div className={`container transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="-mx-4 sticky top-0 z-40 border-b border-[rgba(15,77,50,0.08)] bg-[rgba(255,255,255,0.92)]/95 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              href={href}
              aria-label={`Quay lại ${section.toLowerCase()}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)] shadow-[0_10px_18px_rgba(15,77,50,0.08)]"
            >
              <ArrowLeft size={18} weight="bold" />
            </Link>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">{section}</div>
              <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">{title}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
