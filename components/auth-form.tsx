"use client";

import Link from "next/link";
import { useState } from "react";
import { brand } from "@/data/site";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const [submitted, setSubmitted] = useState(false);

  const isLogin = mode === "login";

  return (
    <main className="section pt-10 md:pt-14 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-24">
      <div className="container grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Tài khoản
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">
            {isLogin ? "Đăng nhập" : "Đăng ký thành viên"}
          </h1>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            {isLogin
              ? "Đăng nhập để theo dõi đơn hàng, lưu địa chỉ giao hàng và mua nhanh hơn trong các lần sau."
              : "Tạo tài khoản để theo dõi đơn hàng, lưu thông tin cá nhân và chuẩn bị sẵn cho kết nối Supabase sau này."}
          </p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            {!isLogin ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Họ và tên" name="name" />
                <input className="input" placeholder="Số điện thoại" name="phone" />
              </div>
            ) : null}

            <input className="input" placeholder="Email" type="email" name="email" />
            <input className="input" placeholder="Mật khẩu" type="password" name="password" />

            {!isLogin ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Xác nhận mật khẩu" type="password" name="confirmPassword" />
                <input className="input" placeholder="Tỉnh / Thành phố" name="province" />
              </div>
            ) : null}

            <button className="button button-primary justify-center py-4" type="submit">
              {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {submitted ? (
            <div className="mt-5 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.06)] p-4 text-sm leading-7 text-[var(--green-dark)]">
              Đây là bản mock local. Dữ liệu chưa được gửi đi đâu cả. Khi bạn sẵn sàng, mình sẽ nối form này với
              Supabase hoặc auth provider bạn chọn.
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/san-pham" className="button button-secondary justify-center">
              Xem sản phẩm
            </Link>
            <Link href="/lien-he" className="button button-secondary justify-center">
              Hỗ trợ
            </Link>
          </div>
        </section>

        <aside className="card rounded-[32px] p-6 md:p-8 lg:p-10">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            {isLogin ? "Đồng bộ tài khoản" : "Trải nghiệm thành viên"}
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--green-dark)] md:text-4xl">
            {isLogin
              ? "Sẵn sàng cho đăng nhập thật bằng Supabase."
              : "Sẵn sàng cho hệ thống thành viên, loyalty và thông báo đơn hàng."}
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
            {isLogin
              ? "Khi kết nối Supabase, ta chỉ cần thay phần submit mock bằng auth client và giữ nguyên giao diện hiện tại."
              : "Giao diện này đã chuẩn bị sẵn form, layout, breadcrumb và CTA để triển khai nhanh mà không phải thiết kế lại."}
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "Lưu thông tin mua hàng nhanh",
              "Theo dõi trạng thái đơn",
              "Chuẩn bị cho Supabase Auth",
              "Đồng bộ với web và mini app sau này",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-white/55 px-4 py-4 text-sm font-semibold text-[var(--green-dark)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] bg-[rgba(15,77,50,0.05)] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Fanpage chính thức</div>
            <a
              href={brand.facebook}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-semibold text-[var(--green-dark)] underline decoration-[rgba(15,77,50,0.22)] underline-offset-4"
            >
              {brand.displayName}
            </a>
          </div>

          <div className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <Link
              href={isLogin ? "/dang-ky-thanh-vien" : "/dang-nhap"}
              className="font-semibold text-[var(--green-dark)] underline decoration-[rgba(15,77,50,0.22)] underline-offset-4"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

