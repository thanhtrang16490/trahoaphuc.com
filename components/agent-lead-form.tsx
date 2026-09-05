"use client";

import { useState } from "react";

const inputClass = "w-full rounded-[18px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.03)] px-4 py-3 text-sm text-[var(--green-dark)] outline-none transition focus:border-[var(--green)]";

export function AgentLeadForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/v1/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Lead request failed");
      event.currentTarget.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={submit}>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Họ và tên / doanh nghiệp</span><input required name="name" className={inputClass} placeholder="Nguyễn Văn A hoặc Công ty TNHH..." /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Số điện thoại</span><input required name="phone" type="tel" className={inputClass} placeholder="09xx xxx xxx" /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Khu vực kinh doanh</span><input required name="area" className={inputClass} placeholder="Ninh Bình, Hà Nội, online..." /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Loại hình kinh doanh</span><select name="businessType" className={inputClass}><option>Cửa hàng đặc sản</option><option>Đại lý phân phối</option><option>Bán online / livestream</option><option>Doanh nghiệp quà biếu</option><option>Cá nhân cộng tác</option></select></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Quy mô dự kiến</span><select name="scale" className={inputClass}><option>Mới bắt đầu</option><option>10-30 đơn / tháng</option><option>30-100 đơn / tháng</option><option>Trên 100 đơn / tháng</option></select></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Nhóm sản phẩm quan tâm</span><select name="productInterest" className={inputClass}><option>Trà thảo mộc</option><option>Đặc sản vùng miền</option><option>Quà biếu</option><option>Tất cả danh mục</option></select></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Kênh bán hiện tại</span><select name="salesChannel" className={inputClass}><option>Chưa có kênh bán</option><option>Fanpage / Facebook</option><option>Cửa hàng offline</option><option>Sàn TMĐT</option><option>Kết hợp nhiều kênh</option></select></label>
      </div>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-[var(--green-dark)]">Bạn cần Hòa Phúc hỗ trợ gì?</span><textarea name="message" rows={4} className={inputClass} placeholder="Ví dụ: báo giá, chính sách chiết khấu, bộ ảnh bán hàng..." /></label>
      <button type="submit" disabled={state === "sending"} className="button button-primary w-full justify-center">{state === "sending" ? "Đang gửi..." : "Gửi đăng ký đại lý"}</button>
      {state === "success" ? <p className="rounded-[16px] bg-[rgba(15,77,50,0.08)] p-3 text-sm leading-6 text-[var(--green-dark)]">Đã nhận thông tin. Hòa Phúc sẽ liên hệ tư vấn sớm.</p> : null}
      {state === "error" ? <p className="rounded-[16px] bg-[rgba(166,61,61,0.08)] p-3 text-sm leading-6 text-[#7a1f1f]">Chưa gửi được thông tin. Vui lòng thử lại hoặc gọi trực tiếp cho Hòa Phúc.</p> : null}
      <p className="text-[12px] leading-6 text-[var(--muted)]">Bằng việc gửi form, bạn đồng ý để Hòa Phúc liên hệ tư vấn qua điện thoại hoặc fanpage.</p>
    </form>
  );
}
