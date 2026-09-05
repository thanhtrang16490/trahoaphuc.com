"use client";

import Link from "next/link";
import { useState } from "react";
import { brand } from "@/data/site";
import { saveAuthUser } from "@/components/auth-store";
import { createClient } from "@/lib/supabase/client";
import { vietnamProvinces } from "@/data/vietnam-address";
import { trackEvent } from "@/lib/analytics";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              : "Tạo tài khoản để theo dõi đơn hàng, lưu thông tin cá nhân và mua nhanh hơn trong các lần sau."}
          </p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const identifier = (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "";
              const password = (form.elements.namedItem("password") as HTMLInputElement | null)?.value ?? "";
              const name = (form.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "";
              const phone = (form.elements.namedItem("phone") as HTMLInputElement | null)?.value ?? "";
              const province = (form.elements.namedItem("province") as HTMLSelectElement | null)?.value ?? "";
              const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement | null)?.value ?? "";
              setError(null);
              setSubmitted(false);
              setSuccessMessage("");

              if (!isLogin && password !== confirmPassword) {
                setError("Mật khẩu xác nhận chưa khớp.");
                return;
              }

              setIsSubmitting(true);

              try {
                const supabase = createClient();
                if (isLogin) {
                  const response = await fetch("/api/v1/auth/login", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ identifier, password }),
                  });
                  const payload = await response.json();
                  if (!response.ok || !payload.ok || !payload.data) throw new Error(payload?.error?.message || "Không thể đăng nhập.");
                  const user = payload.data;
                  trackEvent("login", { method: "password" });

                  saveAuthUser({
                    id: user.id,
                    name: String(user.name ?? user.email?.split("@")[0] ?? ""),
                    email: user.email ?? identifier,
                    phone: String(user.phone ?? ""),
                    role: user.role === "admin" ? "admin" : "customer",
                  });
                  trackEvent("sign_up", { method: "password" });
                  if (user.role === "admin") {
                    window.location.assign("/quan-tri");
                    return;
                  }
                  setSuccessMessage("Đăng nhập thành công. Bạn có thể theo dõi đơn hàng trong Cá nhân.");
                } else {
                  const { data, error: authError } = await supabase.auth.signUp({
                    email: identifier.trim(),
                    password,
                    options: { data: { name: name.trim(), phone: phone.trim(), province: province.trim() } },
                  });
                  if (authError || !data.user) throw new Error(authError?.message || "Không thể tạo tài khoản.");

                  saveAuthUser({
                    id: data.user.id,
                    name: name.trim(),
                    email: data.user.email ?? identifier.trim(),
                    phone: phone.trim(),
                    role: "customer",
                  });
                  if (data.session) {
                    void fetch("/api/v1/notifications/telegram", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
                    });
                  }
                  setSuccessMessage(data.session ? "Tạo tài khoản thành công." : "Tài khoản đã được tạo. Hãy kiểm tra email để xác nhận trước khi đăng nhập.");
                }

                setSubmitted(true);
              } catch (authError) {
                setError(authError instanceof Error ? authError.message : "Không thể hoàn tất xác thực. Vui lòng thử lại.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {!isLogin ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Họ và tên" name="name" />
                <input className="input" placeholder="Số điện thoại" name="phone" />
              </div>
            ) : null}

            <input
              className="input"
              placeholder={isLogin ? "Email hoặc ID admin" : "Email"}
              type={isLogin ? "text" : "email"}
              name="email"
              autoComplete={isLogin ? "username" : "email"}
              required
            />
            <input className="input" placeholder="Mật khẩu" type="password" name="password" minLength={6} required />

            {!isLogin ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Xác nhận mật khẩu" type="password" name="confirmPassword" minLength={6} required />
                <select className="input" name="province" defaultValue=""><option value="">Tỉnh / Thành phố</option>{vietnamProvinces.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              </div>
            ) : null}

            <button className="button button-primary justify-center py-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {error ? (
            <div className="mt-5 rounded-[24px] border border-[rgba(166,61,61,0.16)] bg-[rgba(166,61,61,0.08)] p-4 text-sm leading-7 text-[#7a1f1f]">
              {error}
            </div>
          ) : null}

          {submitted ? (
            <div className="mt-5 rounded-[24px] border border-[rgba(15,77,50,0.12)] bg-[rgba(15,77,50,0.06)] p-4 text-sm leading-7 text-[var(--green-dark)]">
              {successMessage}
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
              ? "Đăng nhập thật bằng Supabase Auth."
              : "Tài khoản thành viên, loyalty và thông báo đơn hàng."}
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
            {isLogin
              ? "Tài khoản được xác thực bằng email và mật khẩu trên Supabase, không lưu mật khẩu trong trình duyệt."
              : "Thông tin hồ sơ được lưu trong Supabase Auth để dùng cho lịch sử đơn hàng và các ưu đãi cá nhân."}
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "Lưu thông tin mua hàng nhanh",
              "Theo dõi trạng thái đơn",
              "Supabase Auth bảo mật",
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
