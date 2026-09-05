import { notFound, redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminDashboard } from "@/components/admin-dashboard";

const sections: Record<string, string> = { "san-pham": "Sản phẩm", "don-hang": "Đơn hàng", "khach-hang": "Tài khoản", "dai-ly": "Lead", "coupon": "Coupon", "tin-tuc": "Tin tức" };

export const dynamic = "force-dynamic";

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const context = await getAdminContext();
  if (!context) redirect("/dang-nhap?redirect=/quan-tri");
  const { section } = await params;
  const initialTab = sections[section];
  if (!initialTab) notFound();
  return <><AdminSidebar /><AdminDashboard initialTab={initialTab} /></>;
}
