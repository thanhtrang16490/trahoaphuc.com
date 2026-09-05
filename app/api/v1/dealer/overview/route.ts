import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiResponse } from "@/lib/api-v1";

export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return apiError("Vui lòng đăng nhập để xem khu vực đại lý.", 401);
  const admin = createAdminClient();
  const { data: role } = await admin.from("user_roles").select("role").eq("user_id", auth.user.id).maybeSingle();
  if (role?.role !== "dealer") return apiError("Tài khoản chưa được kích hoạt quyền đại lý.", 403);
  const [profile, orders] = await Promise.all([
    admin.from("dealer_profiles").select("business_name, area, business_type, commission_rate, status, note").eq("user_id", auth.user.id).single(),
    admin.from("orders").select("id, order_number, status, payment_status, subtotal_vnd, total_vnd, dealer_commission_rate, dealer_commission_vnd, dealer_commission_status, created_at").eq("dealer_id", auth.user.id).order("created_at", { ascending: false }).limit(100),
  ]);
  if (profile.error || orders.error) return apiError("Chưa thể tải dữ liệu đại lý.", 503);
  const items = orders.data ?? [];
  const eligible = items.filter((item) => item.status !== "cancelled");
  return apiResponse({ profile: profile.data, orders: items, summary: { order_count: eligible.length, commission_pending_vnd: eligible.filter((item) => item.dealer_commission_status === "pending").reduce((sum, item) => sum + Number(item.dealer_commission_vnd), 0), commission_approved_vnd: eligible.filter((item) => item.dealer_commission_status === "approved").reduce((sum, item) => sum + Number(item.dealer_commission_vnd), 0), commission_paid_vnd: eligible.filter((item) => item.dealer_commission_status === "paid").reduce((sum, item) => sum + Number(item.dealer_commission_vnd), 0) } });
}
