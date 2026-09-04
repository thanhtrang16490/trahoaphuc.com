"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatCircleDots, CirclesFour, Envelope, FacebookLogo, House, InstagramLogo, MapPin, Phone, PlayCircle, ShoppingCartSimple, Storefront, TiktokLogo, UserCircle, X } from "@phosphor-icons/react";
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
    <footer className="border-t border-[rgba(15,77,50,0.12)] bg-transparent md:border-white/10 md:bg-[var(--green-dark)] md:text-white">
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
        <div className="w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1600px]">
            <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.25fr] lg:gap-12">
              <div>
                <h2 className="max-w-[22ch] text-sm font-bold uppercase leading-6 tracking-[0.2em] text-white">{brand.legalName}</h2>
                <p className="mt-5 max-w-[42ch] text-sm leading-7 text-white/65">{brand.description} Sản phẩm được chọn lọc từ vùng nguyên liệu Việt Nam, phù hợp dùng hằng ngày và làm quà biếu.</p>
                <p className="mt-3 text-xs leading-6 text-white/45">Mã số thuế: {brand.taxId}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a href={brand.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Hòa Phúc" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#1877f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <FacebookLogo size={18} weight="fill" aria-hidden="true" />
                  </a>
                  <a href={brand.zalo} target="_blank" rel="noreferrer" aria-label="Zalo Hòa Phúc" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#1182fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <img src="/icons8-zalo.svg" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                  </a>
                  <a href={brand.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok Hòa Phúc" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <TiktokLogo size={18} weight="fill" aria-hidden="true" />
                  </a>
                  <a href={brand.instagram} target="_blank" rel="noreferrer" aria-label="Instagram Hòa Phúc" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#d62976] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <InstagramLogo size={18} weight="fill" aria-hidden="true" />
                  </a>
                  <a href={brand.shopee} target="_blank" rel="noreferrer" aria-label="Gian hàng Shopee Hòa Phúc" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ee4d2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <Storefront size={18} weight="bold" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Sản phẩm</h3>
                <nav className="mt-5 grid gap-3 text-sm text-white/60" aria-label="Sản phẩm">
                  <Link href="/san-pham" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Tất cả sản phẩm</Link>
                  <Link href="/muc-san-pham/tra-thao-moc" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Trà thảo mộc</Link>
                  <Link href="/muc-san-pham/duong-sinh" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Dưỡng sinh</Link>
                  <Link href="/muc-san-pham/dac-san-vung-mien" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Đặc sản vùng miền</Link>
                  <Link href="/vong-quay-may-man" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Vòng quay may mắn</Link>
                </nav>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Khám phá</h3>
                <nav className="mt-5 grid gap-3 text-sm text-white/60" aria-label="Khám phá">
                  <Link href="/gioi-thieu" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Về Hòa Phúc</Link>
                  <Link href="/gioi-thieu/cau-chuyen-thuong-hieu" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Câu chuyện thương hiệu</Link>
                  <Link href="/tin-tuc" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Tin tức</Link>
                  <Link href="/feed" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Feed Hòa Phúc</Link>
                  <Link href="/ca-nhan" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Cá nhân</Link>
                </nav>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Chính sách</h3>
                <nav className="mt-5 grid gap-3 text-sm text-white/60" aria-label="Chính sách">
                  <Link href="/chinh-sach-bao-mat" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Chính sách bảo mật</Link>
                  <Link href="/chinh-sach-giao-hang" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Chính sách giao hàng</Link>
                  <Link href="/chinh-sach-doi-tra" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Chính sách đổi trả</Link>
                  <Link href="/chinh-sach-thanh-toan" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Chính sách thanh toán</Link>
                  <Link href="/dieu-khoan-su-dung" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Điều khoản sử dụng</Link>
                  <Link href="/dang-ky-dai-ly" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Đăng ký đại lý</Link>
                  <Link href="/tiep-thi-lien-ket" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Tiếp thị liên kết</Link>
                </nav>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Kết nối</h3>
                <div className="mt-5 space-y-4 text-sm text-white/65">
                  <a href={`tel:${brand.phone.replace(/\s+/g, "")}`} className="flex items-start gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Phone size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--beige)]" aria-hidden="true" /><span><strong className="block text-xs uppercase tracking-[0.12em] text-white/45">Hotline</strong>{brand.phone}</span></a>
                  <a href={brand.zalo} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChatCircleDots size={18} weight="fill" className="mt-0.5 shrink-0 text-[#63b3ff]" aria-hidden="true" /><span><strong className="block text-xs uppercase tracking-[0.12em] text-white/45">Zalo</strong>Nhắn tin tư vấn nhanh</span></a>
                  <a href={`mailto:${brand.email ?? "nongsanhoaphuc@gmail.com"}`} className="flex items-start gap-3 break-all transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Envelope size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--beige)]" aria-hidden="true" /><span>{brand.email ?? "nongsanhoaphuc@gmail.com"}</span></a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><MapPin size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--beige)]" aria-hidden="true" /><span>{brand.address}</span></a>
                </div>
                <Link href="/lien-he" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[var(--green-dark)] transition-colors hover:bg-[#f3ead9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Liên hệ Hòa Phúc <span aria-hidden="true">→</span></Link>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} Nông Sản Hòa Phúc. Tất cả quyền được bảo lưu.</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <span>{brand.legalName}</span>
                <Link href="/chinh-sach-bao-mat" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Bảo mật</Link>
                <Link href="/dieu-khoan-su-dung" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Điều khoản</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
