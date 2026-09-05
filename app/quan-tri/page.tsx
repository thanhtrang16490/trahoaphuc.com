import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminSidebar } from "@/components/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const context = await getAdminContext();
  if (!context) redirect("/dang-nhap?redirect=/quan-tri");
  return <><AdminSidebar /><AdminDashboard /></>;
}
