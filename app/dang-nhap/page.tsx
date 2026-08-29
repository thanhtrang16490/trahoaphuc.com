import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản Hòa Phúc.",
};

export default function LoginPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Đăng nhập", href: "/dang-nhap" }]} />
      <AuthForm mode="login" />
    </>
  );
}

