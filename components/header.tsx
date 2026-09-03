"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { List, MagnifyingGlass, ShoppingCartSimple, UserCircle, X, Plus, Minus, Trash, House, Package, Tag, CirclesFour, FacebookLogo } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { CartItem } from "./cart-store";
import { clearCart, readCart, removeItem, subscribeCart, updateItem } from "./cart-store";
import { formatCurrency } from "@/data/pricing";
import { brand } from "@/data/site";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/gioi-thieu/cau-chuyen-thuong-hieu", label: "Câu chuyện" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
];

const mobileTabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/san-pham", label: "Shop", icon: Package },
  { href: "/gio-hang", label: "Cart", icon: Tag },
  { href: "/dang-nhap", label: "Account", icon: UserCircle },
  { href: "/lien-he", label: "Contact", icon: CirclesFour },
  { href: "https://www.facebook.com/nongsanhoaphucnb/", label: "Fanpage", icon: FacebookLogo, external: true },
];

export function Header() {
  const pathname = usePathname();
  const isFeed = pathname === "/feed";
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();
    return subscribeCart(syncCart);
  }, []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  useEffect(() => {
    if (count === 0) {
      setBadgeBump(false);
      return;
    }

    setBadgeBump(true);
    const timer = window.setTimeout(() => setBadgeBump(false), 220);
    return () => window.clearTimeout(timer);
  }, [count]);

  return (
    <>
      <header className={`${isFeed ? "hidden" : ""} sticky top-0 z-50 border-b border-[rgba(15,77,50,0.1)] bg-[rgba(246,241,231,0.88)] backdrop-blur-xl md:hidden`}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-[var(--green)]">
            <Image src="/brand/hoaphuc-logo.svg" alt="Logo Hòa Phúc" width={34} height={34} className="h-8 w-8 shrink-0" priority />
            <span className="truncate text-xs font-semibold uppercase tracking-[0.16em]">Nông Sản Hòa Phúc</span>
          </Link>
          <Link href="/tim-kiem" aria-label="Tìm kiếm sản phẩm" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 text-[var(--green-dark)] shadow-[0_8px_18px_rgba(15,77,50,0.08)]">
            <MagnifyingGlass size={19} weight="bold" />
          </Link>
        </div>
      </header>
      <header className={`${isFeed ? "hidden" : ""} hidden md:block sticky top-0 z-50 border-b border-[rgba(15,77,50,0.1)] bg-[rgba(246,241,231,0.82)] backdrop-blur-xl`}>
        <div className="container flex items-center justify-between gap-3 py-3 md:gap-4 md:py-4">
          <button className="panel pill p-3 xl:hidden md:order-3" aria-label="Mở menu" onClick={() => setMenuOpen(true)}>
            <List size={20} weight="bold" />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-3 md:block md:flex-none md:justify-start">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--green)] md:text-base">
              <Image src="/brand/hoaphuc-logo.svg" alt="" width={38} height={38} className="h-9 w-9 shrink-0 md:h-10 md:w-10" priority />
              <span>Hòa Phúc Farm</span>
            </Link>
            <div className="hidden text-xs text-[var(--muted)] md:block">Nông sản • Trà thảo mộc • Đặc sản vùng miền</div>
          </div>

          <nav className="hidden xl:flex items-center gap-6 text-sm text-[var(--muted)]">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-[var(--green)]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3 md:order-2">
            <button aria-label="Tìm kiếm" className="hidden md:inline-flex panel pill p-3">
              <MagnifyingGlass size={18} weight="bold" />
            </button>
            <button aria-label="Tài khoản" className="hidden sm:inline-flex panel pill p-3">
              <UserCircle size={18} weight="bold" />
            </button>
            <button aria-label="Giỏ hàng" className="hidden md:inline-flex panel pill relative p-3" onClick={() => setCartOpen(true)}>
              <ShoppingCartSimple size={18} weight="bold" />
              {count > 0 ? (
                <span
                  className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--green)] px-1 text-[10px] font-bold leading-none text-white transition-transform duration-200 ${
                    badgeBump ? "scale-110" : "scale-100"
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[60] bg-[rgba(11,24,18,0.42)]" onClick={() => setMenuOpen(false)}>
          <aside
            className="absolute left-0 top-0 h-full w-full max-w-[420px] overflow-y-auto bg-[var(--surface-strong)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Điều hướng</div>
                <h2 className="text-2xl font-semibold text-[var(--green-dark)]">Menu</h2>
              </div>
              <button className="panel pill p-3" aria-label="Đóng menu" onClick={() => setMenuOpen(false)}>
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/70 px-4 py-4 text-sm font-semibold text-[var(--green-dark)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] bg-[rgba(15,77,50,0.06)] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Kênh chính thức</div>
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm font-semibold text-[var(--green-dark)] underline decoration-[rgba(15,77,50,0.22)] underline-offset-4"
              >
                Fanpage {brand.displayName}
              </a>
              <div className="mt-3 text-sm text-[var(--muted)]">{brand.phone}</div>
            </div>
          </aside>
        </div>
      ) : null}

      {cartOpen ? (
        <div className="fixed inset-0 z-[60] bg-[rgba(11,24,18,0.42)]" onClick={() => setCartOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[420px] overflow-y-auto bg-[var(--surface-strong)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Giỏ hàng</div>
                <h2 className="text-2xl font-semibold text-[var(--green-dark)]">Mua nhanh</h2>
              </div>
              <button className="panel pill p-3" aria-label="Đóng giỏ hàng" onClick={() => setCartOpen(false)}>
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {items.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[rgba(15,77,50,0.2)] p-8 text-center text-sm text-[var(--muted)]">
                  Giỏ hàng đang trống. Hãy thêm một sản phẩm từ trang chủ hoặc trang chi tiết sản phẩm.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.slug} className="flex gap-4 rounded-[24px] border border-[rgba(15,77,50,0.12)] p-3">
                    <div className="h-20 w-20 overflow-hidden rounded-[18px] bg-[rgba(15,77,50,0.08)]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[var(--green-dark)]">{item.name}</div>
                      <div className="mt-1 text-sm text-[var(--muted)]">{formatCurrency(item.price)}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="panel pill p-2" onClick={() => updateItem(item.slug, -1)} aria-label="Giảm số lượng">
                          <Minus size={14} weight="bold" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button className="panel pill p-2" onClick={() => updateItem(item.slug, 1)} aria-label="Tăng số lượng">
                          <Plus size={14} weight="bold" />
                        </button>
                        <button className="ml-auto panel pill p-2" onClick={() => removeItem(item.slug)} aria-label="Xóa sản phẩm">
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-[28px] bg-[rgba(15,77,50,0.06)] p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Tạm tính</span>
                <span className="font-semibold text-[var(--green-dark)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/gio-hang" className="button button-primary w-full justify-center" onClick={() => setCartOpen(false)}>
                  Đi tới thanh toán
                </Link>
                <button className="button button-secondary w-full justify-center" onClick={clearCart}>
                  Xóa toàn bộ
                </button>
              </div>
              <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                Đây là checkout mô phỏng local để demo UX. Có thể thay thế bằng cổng thanh toán thật ở bước sau.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
