"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminCouponCreateForm, AdminNewsCreateForm, AdminProductCreateForm, AdminProductManager, AdminUserManager, AdminOrderManager, AdminDealerManager, AdminLoyaltyManager } from "@/components/admin-crud-panels";

type AdminData = {
  role: string;
  user_id: string;
  categories: Array<{ id: string; name: string }>;
  products: Array<{ id: string; name: string; slug: string; category_id: string; short_description?: string; long_description?: string; package_label?: string; image?: string; box_image?: string; origin?: string; stock_quantity: number; is_active: boolean; product_prices?: Array<{ price_vnd: number; original_price_vnd: number }> }>;
  orders: Array<{ id: string; order_number: string; customer_id?: string | null; dealer_id?: string | null; dealer_commission_rate?: number; dealer_commission_vnd?: number; dealer_commission_status?: string; customer_name: string; customer_email: string; customer_phone: string; recipient_name: string; recipient_email: string; recipient_phone: string; shipping_address: string; shipping_note: string; total_vnd: number; subtotal_vnd: number; shipping_fee_vnd: number; discount_vnd: number; status: string; payment_status: string; payment_method: string; coupon_code: string | null; created_at: string; order_items: Array<{ id: string; product_name: string; product_slug: string; unit_price_vnd: number; quantity: number; line_total_vnd: number }> }>;
  users: Array<{ id: string; email: string; full_name: string; phone: string; province: string; account_type: string; is_active: boolean; created_at: string }>;
  roles: Array<{ user_id: string; role: string }>;
  leads: Array<{ id: string; name: string; phone: string; area: string; business_type: string; status: string; created_at: string }>;
  coupons: Array<{ id: string; code: string; label: string; is_active: boolean; usage_count: number; usage_limit: number | null }>;
  news: Array<{ id: string; title: string; category: string; status: string; updated_at: string }>;
};

const money = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + "đ";
const tabs = ["Tổng quan", "Sản phẩm", "Đơn hàng", "Đại lý", "Hội viên", "Tài khoản", "Lead", "Coupon", "Tin tức"];

export function AdminDashboard({ initialTab = "Tổng quan" }: { initialTab?: string }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/overview", { cache: "no-store" });
    const payload = await response.json();
    if (response.ok && payload.ok) setData(payload.data);
    else setMessage(payload?.error?.message || "Không thể tải dữ liệu quản trị.");
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function update(path: string, body: Record<string, unknown>) {
    setMessage("");
    const response = await fetch(path, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) setMessage(payload?.error?.message || "Cập nhật thất bại.");
    else { setMessage("Đã cập nhật dữ liệu."); await load(); }
  }

  if (loading) return <main className="min-h-[70vh] p-8"><div className="mx-auto max-w-7xl animate-pulse rounded-[32px] bg-[rgba(15,77,50,0.08)] p-12">Đang tải khu vực quản trị...</div></main>;
  if (!data) return <main className="min-h-[70vh] p-8"><div className="mx-auto max-w-2xl rounded-[28px] bg-white p-8 text-[#7a1f1f]">{message || "Không có dữ liệu."}</div></main>;

  const roleMap = new Map(data.roles.map((item) => [item.user_id, item.role]));
  const stats = [["Sản phẩm đang bán", data.products.filter((item) => item.is_active).length], ["Đơn chờ xử lý", data.orders.filter((item) => !["delivered", "cancelled"].includes(item.status)).length], ["Doanh thu đã giao", money(data.orders.filter((item) => item.status === "delivered").reduce((total, item) => total + item.total_vnd, 0))], ["Tồn kho thấp", data.products.filter((item) => item.is_active && item.stock_quantity <= 10).length], ["Tài khoản", data.users.length], ["Lead mới", data.leads.filter((item) => item.status === "new").length]];

  return (
    <main className="min-h-screen bg-[#f4f7ef] px-4 py-6 pb-24 md:px-8 md:py-10 md:pb-24 lg:-ml-16 lg:pl-24">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5"><div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Hòa Phúc Admin · {data.role}</div><h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[var(--green-dark)] md:text-6xl">Trung tâm vận hành.</h1><p className="mt-3 text-sm leading-7 text-[var(--muted)]">Quản lý catalog, đơn hàng, khách hàng, đại lý, lead và nội dung.</p></div><Link href="/" className="button button-secondary">Về website</Link></header>
        <nav className="mt-8 flex gap-2 overflow-x-auto border-b border-[rgba(15,77,50,0.12)] pb-2">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-[var(--green-dark)] text-white" : "text-[var(--muted)] hover:bg-white"}`}>{tab}</button>)}</nav>
        {message ? <div className="mt-4 rounded-[16px] bg-[rgba(15,77,50,0.08)] px-4 py-3 text-sm text-[var(--green-dark)]">{message}</div> : null}
        {activeTab === "Tổng quan" ? <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{stats.map(([label, value]) => <article key={label} className="rounded-[24px] bg-white p-5 shadow-[0_10px_24px_rgba(15,77,50,0.06)]"><div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{label}</div><div className="mt-3 text-3xl font-semibold text-[var(--green-dark)]">{value}</div></article>)}</section> : null}
        {activeTab === "Sản phẩm" ? <section className="mt-6"><AdminProductCreateForm categories={data.categories} onDone={() => void load()} /><div className="mt-5"><AdminProductManager products={data.products} categories={data.categories} onDone={() => void load()} /></div></section> : null}
        {activeTab === "Đơn hàng" ? <section className="mt-6"><AdminOrderManager orders={data.orders} products={data.products} users={data.users} onUpdate={update} onDone={() => void load()} /></section> : null}
        {activeTab === "Đại lý" ? <section className="mt-6"><AdminDealerManager /></section> : null}
        {activeTab === "Hội viên" ? <section className="mt-6"><AdminLoyaltyManager /></section> : null}
        {activeTab === "Tài khoản" ? <section className="mt-6"><AdminUserManager users={data.users} roles={data.roles} currentUserId={data.user_id} onDone={() => void load()} /></section> : null}
        {activeTab === "Lead" ? <section className="admin-table mt-6">{data.leads.length ? data.leads.map((item) => <div key={item.id} className="admin-row"><div><b>{item.name}</b><div className="text-xs text-[var(--muted)]">{item.phone} · {item.area} · {item.business_type}</div></div><select className="input w-36" value={item.status} onChange={(event) => void update(`/api/admin/leads/${item.id}`, { status: event.target.value })}><option value="new">Mới</option><option value="contacted">Đã liên hệ</option><option value="qualified">Tiềm năng</option><option value="closed">Đã chốt</option><option value="discarded">Loại</option></select></div>) : <Empty text="Chưa có lead." />}</section> : null}
        {activeTab === "Coupon" ? <section className="mt-6"><AdminCouponCreateForm onDone={() => void load()} /><div className="admin-table mt-5">{data.coupons.map((item) => <div key={item.id} className="admin-row"><div><b>{item.code}</b><div className="text-xs text-[var(--muted)]">{item.label}</div></div><span className="text-sm text-[var(--muted)]">Đã dùng {item.usage_count}{item.usage_limit ? ` / ${item.usage_limit}` : ""}</span><span>{item.is_active ? "Đang bật" : "Đã tắt"}</span><button type="button" className="button button-secondary px-3 py-2 text-xs" onClick={() => void update(`/api/admin/coupons/${item.id}`, { is_active: !item.is_active })}>{item.is_active ? "Tắt coupon" : "Bật coupon"}</button></div>)}</div></section> : null}
        {activeTab === "Tin tức" ? <section className="mt-6"><AdminNewsCreateForm onDone={() => void load()} /><div className="admin-table mt-5">{data.news.map((item) => <div key={item.id} className="admin-row"><div><b>{item.title}</b><div className="text-xs text-[var(--muted)]">{item.category}</div></div><select className="input w-32" value={item.status} onChange={(event) => void update(`/api/admin/news/${item.id}`, { status: event.target.value })}><option value="draft">Bản nháp</option><option value="published">Đã đăng</option><option value="archived">Lưu trữ</option></select></div>)}</div></section> : null}
      </div>
    </main>
  );
}

function Empty({ text }: { text: string }) { return <div className="rounded-[24px] bg-white p-8 text-center text-sm text-[var(--muted)]">{text}</div>; }
