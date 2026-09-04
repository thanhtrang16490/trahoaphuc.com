"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CaretDown, CaretRight, CirclesFour, Envelope, House, Info, Newspaper, Package, PlayCircle, Tag, UserCircle } from "@phosphor-icons/react";

const menuItems = [
  { label: "Trang chủ", href: "/", icon: House },
  {
    label: "Sản phẩm",
    icon: Package,
    children: [
      { label: "Tất cả sản phẩm", href: "/san-pham" },
      { label: "Trà thảo mộc", href: "/muc-san-pham/tra-thao-moc" },
      { label: "Dưỡng sinh", href: "/muc-san-pham/duong-sinh" },
      { label: "Đặc sản vùng miền", href: "/muc-san-pham/dac-san-vung-mien" },
    ],
  },
  { label: "Danh mục", href: "/muc-san-pham", icon: CirclesFour },
  { label: "Feed", href: "/feed", icon: PlayCircle },
  { label: "Tin tức", href: "/tin-tuc", icon: Newspaper },
  { label: "Ưu đãi", href: "/ca-nhan#uu-dai", icon: Tag },
  { label: "Giới thiệu", href: "/gioi-thieu", icon: Info },
  { label: "Liên hệ", href: "/lien-he", icon: Envelope },
  { label: "Cá nhân", href: "/ca-nhan", icon: UserCircle },
] as const;

export function GlobalSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [productsOpen, setProductsOpen] = useState(pathname.startsWith("/san-pham") || pathname.startsWith("/muc-san-pham"));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[55] hidden overflow-hidden border-r border-white/40 bg-white/75 shadow-[4px_0_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-[width] duration-300 ease-out lg:block ${expanded ? "w-[280px]" : "w-16"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label="Điều hướng chính"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/20" />
      <div className={`relative z-10 flex h-16 items-center border-b border-white/40 transition-all duration-300 ${expanded ? "justify-start px-5" : "justify-center"}`}>
        <Link href="/" aria-label="Về trang chủ" className="flex items-center gap-3">
          <img src="/brand/hoaphuc-logo.svg" alt="Hòa Phúc" className="h-8 w-8 shrink-0 object-contain" />
          <span className={`whitespace-nowrap text-sm font-bold tracking-[-0.02em] text-[var(--green-dark)] transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>Nông Sản Hòa Phúc</span>
        </Link>
      </div>

      <nav className="relative z-10 flex h-[calc(100vh-64px)] flex-col gap-1 overflow-y-auto p-2" aria-label="Menu website">
        <div className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = "children" in item;
            const active = isActive("href" in item ? item.href : "/muc-san-pham");

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setProductsOpen((value) => !value)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${expanded ? "justify-start" : "justify-center"} ${active ? "text-[var(--green-dark)]" : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--green-dark)]"}`}
                    title={expanded ? undefined : item.label}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[var(--green)]" />
                    {expanded ? <><span>{item.label}</span>{productsOpen ? <CaretDown className="ml-auto h-4 w-4" /> : <CaretRight className="ml-auto h-4 w-4" />}</> : null}
                  </button>
                  {expanded ? (
                    <div className={`ml-4 mt-1 space-y-0.5 overflow-hidden border-l border-[rgba(15,77,50,0.16)] pl-4 transition-all duration-300 ${productsOpen ? "max-h-64 opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}>
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActive(child.href) ? "bg-[rgba(15,77,50,0.08)] font-semibold text-[var(--green-dark)]" : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--green-dark)]"}`}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link key={item.label} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${expanded ? "justify-start" : "justify-center"} ${active ? "bg-[rgba(15,77,50,0.08)] text-[var(--green-dark)]" : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--green-dark)]"}`} title={expanded ? undefined : item.label}>
                <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[var(--green)]" : "text-[var(--muted)]"}`} />
                {expanded ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </div>

        <div className={`border-t border-white/50 pt-3 text-xs text-[var(--muted)] transition-opacity ${expanded ? "opacity-100" : "opacity-0"}`}>
          <div className="px-3 leading-5">Trà thảo mộc Việt từ Cúc Phương, Ninh Bình.</div>
        </div>
      </nav>
    </aside>
  );
}
