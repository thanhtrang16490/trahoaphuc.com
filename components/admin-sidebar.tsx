"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBar, ClipboardText, Cube, Gear, House, Medal, Newspaper, Tag, UsersThree, UserSwitch } from "@phosphor-icons/react";

const items = [
  { label: "Tổng quan", href: "/quan-tri", icon: ChartBar },
  { label: "Sản phẩm & tồn kho", href: "/quan-tri/san-pham", icon: Cube },
  { label: "Đơn hàng", href: "/quan-tri/don-hang", icon: ClipboardText },
  { label: "Khách hàng & tài khoản", href: "/quan-tri/khach-hang", icon: UsersThree },
  { label: "Đại lý", href: "/quan-tri/dai-ly", icon: UserSwitch },
  { label: "Hội viên & điểm thưởng", href: "/quan-tri/hoi-vien", icon: Medal },
  { label: "Lead", href: "/quan-tri/lead", icon: UserSwitch },
  { label: "Mã giảm giá", href: "/quan-tri/coupon", icon: Tag },
  { label: "Tin tức", href: "/quan-tri/tin-tuc", icon: Newspaper },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const activeHref = pathname === "/quan-tri" ? "/quan-tri" : pathname;

  return (
    <>
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-[56] hidden w-[248px] overflow-hidden border-r border-white/50 bg-[#102f24]/95 text-white shadow-[8px_0_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl lg:block" aria-label="Điều hướng quản trị">
        <div className="flex h-16 items-center border-b border-white/10 px-4"><Link href="/quan-tri" className="flex items-center gap-3"><img src="/brand/hoaphuc-logo.svg" alt="Hòa Phúc" className="h-8 w-8 shrink-0 rounded-full bg-white object-contain p-1" /><span className="whitespace-nowrap text-sm font-semibold">Hòa Phúc Admin</span></Link></div>
        <nav className="flex h-[calc(100vh-64px)] flex-col gap-1 p-2" aria-label="Menu quản trị">
          <div className="flex-1 space-y-1">{items.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${activeHref === href ? "bg-white/15 font-semibold text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`} title={label}><Icon className="h-5 w-5 shrink-0" weight={activeHref === href ? "fill" : "regular"} /><span className="whitespace-nowrap">{label}</span></Link>)}</div>
          <div className="space-y-1 border-t border-white/10 pt-3"><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/10 hover:text-white"><House className="h-5 w-5 shrink-0" /><span className="whitespace-nowrap">Về website</span></Link><Link href="/ca-nhan" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/10 hover:text-white"><Gear className="h-5 w-5 shrink-0" /><span className="whitespace-nowrap">Tài khoản cá nhân</span></Link></div>
        </nav>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-[56] hidden border-t border-white/10 bg-[#102f24]/95 px-3 py-2 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl max-lg:flex" aria-label="Menu quản trị mobile"><div className="flex w-full gap-1 overflow-x-auto">{items.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={`flex min-w-[74px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] ${activeHref === href ? "bg-white/15 text-white" : "text-white/65"}`}><Icon size={19} weight={activeHref === href ? "fill" : "regular"} /><span>{label}</span></Link>)}</div></nav>
    </>
  );
}
