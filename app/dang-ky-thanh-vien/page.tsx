import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Đăng ký thành viên",
  description: "Đăng ký thành viên Hòa Phúc để theo dõi đơn hàng và chuẩn bị kết nối Supabase sau này.",
};

export default function RegisterPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", href: "/" }, { name: "Đăng ký thành viên", href: "/dang-ky-thanh-vien" }]} />
      <AuthForm mode="register" />
    </>
  );
}

