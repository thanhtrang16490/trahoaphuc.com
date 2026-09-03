"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CirclesFour, House, PlayCircle, ShoppingCartSimple, UserCircle, MessengerLogo, FacebookLogo, Storefront, X } from "@phosphor-icons/react";
import type { CartItem } from "@/components/cart-store";
import { addProductToCart, readCart, subscribeCart } from "@/components/cart-store";
import { useToast } from "@/components/toast";
import { getProductBySlug } from "@/data/product-utils";
import { brand } from "@/data/site";

const bottomNav = [
  { href: "/", label: "Trang chủ", icon: House },
  { href: "/feed", label: "Feed", icon: PlayCircle },
  { href: "#danh-muc", label: "Danh mục", icon: CirclesFour },
  { href: "/gio-hang", label: "Giỏ hàng", icon: ShoppingCartSimple },
  { href: "/ca-nhan", label: "Cá nhân", icon: UserCircle },
];

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [badgeBump, setBadgeBump] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const isProductDetail = pathname.startsWith("/san-pham/");
  const currentProductSlug = isProductDetail ? pathname.split("/").filter(Boolean)[1] : null;
  const currentProduct = currentProductSlug ? getProductBySlug(currentProductSlug) : undefined;
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const categories = [
    { href: "/muc-san-pham", label: "Tất cả sản phẩm", description: "Xem toàn bộ danh mục Hòa Phúc" },
    { href: "/muc-san-pham/tra-thao-moc", label: "Trà thảo mộc", description: "Những vị trà thanh lành mỗi ngày" },
    { href: "/muc-san-pham/duong-sinh", label: "Dưỡng sinh", description: "Lựa chọn mộc lành cho nhịp sống cân bằng" },
    { href: "/muc-san-pham/dac-san-vung-mien", label: "Đặc sản vùng miền", description: "Quà tặng mang hương vị Việt" },
  ];

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();
    return subscribeCart(syncCart);
  }, []);

  useEffect(() => {
    if (cartCount === 0) {
      setBadgeBump(false);
      return;
    }

    setBadgeBump(true);
    const timer = window.setTimeout(() => setBadgeBump(false), 220);
    return () => window.clearTimeout(timer);
  }, [cartCount]);

  useEffect(() => {
    if (!categoryOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoryOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [categoryOpen]);

  const handleBuyNow = () => {
    if (!currentProduct) {
      router.push("/gio-hang");
      return;
    }

    addProductToCart(currentProduct);
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `${currentProduct.name} · Mua ngay`,
    });
    router.push("/gio-hang");
  };

  return (
    <footer className="border-t border-[rgba(15,77,50,0.12)] bg-transparent md:bg-[rgba(246,241,231,0.72)]">
      <div className="md:hidden">
        <div className="fixed inset-x-0 bottom-0 z-40">
          <div className={`mx-auto max-w-screen-sm ${isProductDetail ? "px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2" : "w-full px-0 pb-[env(safe-area-inset-bottom)] pt-0"}`}>
            {isProductDetail ? (
              <div className="relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.55)] bg-[rgba(255,255,255,0.68)] p-1.5 shadow-[0_18px_42px_rgba(15,77,50,0.14)] backdrop-blur-2xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.18)_28%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.22)_72%,rgba(255,255,255,0.68)_100%)]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-3 top-1 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]"
                />
                <div className="relative z-10 grid grid-cols-2 gap-1">
                  <Link
                    href="/gio-hang"
                    className="flex min-h-[56px] items-center justify-center gap-2 rounded-[20px] bg-transparent text-[10px] font-semibold text-[var(--green-dark)]"
                  >
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-[var(--green-dark)]">
                      <ShoppingCartSimple size={20} weight="bold" />
                      {cartCount > 0 ? (
                        <span
                          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--green)] px-1 text-[10px] font-bold leading-none text-white shadow-[0_8px_16px_rgba(15,77,50,0.18)] transition-transform duration-200 ${
                            badgeBump ? "scale-110" : "scale-100"
                          }`}
                        >
                          {cartCount}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[14px] leading-none">Giỏ hàng</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex min-h-[56px] items-center justify-center gap-2 rounded-[20px] bg-[linear-gradient(180deg,#0f4d32,#063b27)] text-[10px] font-semibold text-white shadow-[0_12px_28px_rgba(15,77,50,0.24)]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-white">
                      <ShoppingCartSimple size={20} weight="fill" />
                    </span>
                    <span className="text-[14px] leading-none text-white">Mua ngay</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="liquid-glass-nav relative !rounded-none grid grid-cols-5 gap-0 p-1">
                {bottomNav.map((item) => {
                  const Icon = item.icon;
                  const isCategory = item.href === "#danh-muc";
                  const active = isCategory ? categoryOpen : item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return isCategory ? (
                    <button key={item.href} type="button" onClick={() => setCategoryOpen(true)} className="relative z-10 flex min-h-[48px] flex-col items-center justify-center rounded-[16px] bg-transparent text-[10px] font-semibold text-[var(--green-dark)] transition-[transform,background-color] duration-200 active:scale-[0.96]">
                      <span className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-[transform,background-color,box-shadow] duration-200 ${active ? "bg-[var(--green)] text-white shadow-[0_10px_18px_rgba(15,77,50,0.18)]" : "bg-transparent text-[var(--green-dark)]"}`}><Icon size={18} weight={active ? "fill" : "bold"} /></span>
                      <span className="mt-1 leading-none text-[var(--green-dark)]">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative z-10 flex min-h-[48px] flex-col items-center justify-center rounded-[16px] bg-transparent text-[10px] font-semibold text-[var(--green-dark)] transition-[transform,background-color] duration-200 active:scale-[0.96]"
                    >
                      <span
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-[transform,background-color,box-shadow] duration-200 ${
                          active
                            ? "bg-[var(--green)] text-white shadow-[0_10px_18px_rgba(15,77,50,0.18)]"
                            : "bg-transparent text-[var(--green-dark)]"
                        }`}
                      >
                        <Icon size={18} weight={active ? "fill" : "bold"} />
                        {item.href === "/gio-hang" && cartCount > 0 ? (
                          <span
                            className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--green)] px-1 text-[10px] font-bold leading-none text-white shadow-[0_8px_16px_rgba(15,77,50,0.18)] transition-transform duration-200 ${
                              badgeBump ? "scale-110" : "scale-100"
                            }`}
                          >
                            {cartCount}
                          </span>
                        ) : null}
                      </span>
                      <span className={`mt-1 leading-none ${active ? "text-[var(--green-dark)]" : "text-[var(--green-dark)]/80"}`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {categoryOpen ? (
          <div className="fixed inset-0 z-[70] bg-[rgba(6,31,20,0.38)]" role="presentation" onClick={() => setCategoryOpen(false)}>
            <aside className="h-full w-[min(88vw,380px)] animate-[drawer-in_320ms_cubic-bezier(0.22,1,0.36,1)] bg-[var(--surface-strong)] p-5 shadow-[30px_0_70px_rgba(6,31,20,0.18)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4"><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Khám phá</div><h2 className="mt-1 text-2xl font-semibold text-[var(--green-dark)]">Danh mục sản phẩm</h2></div><button type="button" onClick={() => setCategoryOpen(false)} aria-label="Đóng danh mục" className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(15,77,50,0.06)] text-[var(--green-dark)]"><X size={18} weight="bold" /></button></div>
              <nav className="mt-7 grid gap-2" aria-label="Danh mục sản phẩm">{categories.map((category) => <Link key={category.href} href={category.href} onClick={() => setCategoryOpen(false)} className="rounded-[20px] border border-[rgba(15,77,50,0.1)] bg-white px-4 py-4 transition-transform active:scale-[0.98]"><div className="text-sm font-semibold text-[var(--green-dark)]">{category.label}</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">{category.description}</div></Link>)}</nav>
            </aside>
          </div>
        ) : null}
      </div>

      <div className="hidden md:block">
        <div className="container grid gap-10 pt-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr] lg:pt-16">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--green)]">
              {brand.legalName}
            </div>
            <p className="mt-4 max-w-[50ch] text-sm leading-7 text-[var(--muted)]">
              Mã số thuế {brand.taxId}. {brand.description} Đồng bộ nhận diện cho website, app và mini app trong tương lai.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 text-[var(--green-dark)] transition-transform duration-200 hover:-translate-y-0.5 hover:text-[var(--green)]"
              >
                <MessengerLogo size={19} weight="fill" />
              </a>
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Fanpage Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 text-[var(--green-dark)] transition-transform duration-200 hover:-translate-y-0.5 hover:text-[var(--green)]"
              >
                <FacebookLogo size={19} weight="fill" />
              </a>
              <a
                href="/lien-he"
                aria-label="Liên hệ"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 text-[var(--green-dark)] transition-transform duration-200 hover:-translate-y-0.5 hover:text-[var(--green)]"
              >
                <UserCircle size={19} weight="bold" />
              </a>
              <a
                href={brand.shopee}
                target="_blank"
                rel="noreferrer"
                aria-label="Shopee"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white/70 text-[var(--green-dark)] transition-transform duration-200 hover:-translate-y-0.5 hover:text-[var(--green)]"
              >
                <Storefront size={19} weight="bold" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-dark)]">Điều hướng</div>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <Link href="/san-pham">Sản phẩm</Link>
              <Link href="/gio-hang">Giỏ hàng</Link>
              <Link href="/lien-he">Liên hệ</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-dark)]">Kết nối</div>
            <div className="mt-4 grid gap-4 text-sm text-[var(--muted)]">
              <a className="inline-flex items-center gap-2" href={`tel:${brand.phone.replace(/\s+/g, "")}`}>
                {brand.phone}
              </a>
              <div className="inline-flex items-start gap-2">
                <span>{brand.address}</span>
              </div>
              <div className="text-sm leading-7">Người đại diện: VŨ HUYỀN TRANG</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-dark)]">Chính sách</div>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link href="/chinh-sach-giao-hang">Chính sách giao hàng</Link>
              <Link href="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
              <Link href="/chinh-sach-thanh-toan">Chính sách thanh toán</Link>
              <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
              <Link href="/dang-ky-dai-ly">Đăng ký đại lý</Link>
              <Link href="/tiep-thi-lien-ket">Tiếp thị liên kết</Link>
              <Link href="/dang-ky-thanh-vien">Đăng ký thành viên</Link>
              <Link href="/dang-nhap">Đăng nhập</Link>
            </div>
          </div>
        </div>
        <div className="container mt-10 border-t border-[rgba(15,77,50,0.12)] py-5 text-xs text-[var(--muted)]">
          © 2026 Nông Sản Hòa Phúc. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
