import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

function maskName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Hội viên Hòa Phúc";
  if (parts.length === 1) return `${parts[0][0]}***`;
  return `${parts[0]} ${parts.slice(1, -1).map((part) => `${part[0]}.`).join(" ")} ${parts.at(-1)?.[0] ?? ""}***`;
}

function tierForPoints(points: number) {
  if (points >= 3000) return "Hội viên vàng";
  if (points >= 1000) return "Hội viên thân thiết";
  return "Thành viên mới";
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }, { data: orders, error: ordersError }] = await Promise.all([
      admin.from("profiles").select("id, full_name, province, account_type, is_active, created_at").eq("is_active", true).eq("account_type", "customer").order("created_at", { ascending: false }).limit(100),
      admin.from("user_roles").select("user_id, role"),
      admin.from("orders").select("customer_id, subtotal_vnd, status").not("customer_id", "is", null).in("status", ["confirmed", "processing", "shipped", "delivered"]),
    ]);
    if (profilesError || rolesError || ordersError) return apiError("Chưa thể tải danh sách hội viên.", 503);

    const blockedIds = new Set((roles ?? []).filter((role) => ["admin", "staff", "editor", "dealer"].includes(role.role)).map((role) => role.user_id));
    const orderByCustomer = new Map<string, { orders: number; spend: number }>();
    for (const order of orders ?? []) {
      if (!order.customer_id) continue;
      const current = orderByCustomer.get(order.customer_id) ?? { orders: 0, spend: 0 };
      current.orders += 1;
      current.spend += Number(order.subtotal_vnd ?? 0);
      orderByCustomer.set(order.customer_id, current);
    }

    const members = (profiles ?? []).filter((profile) => !blockedIds.has(profile.id)).map((profile) => {
      const stats = orderByCustomer.get(profile.id) ?? { orders: 0, spend: 0 };
      const points = Math.floor(stats.spend / 1000);
      return {
        name: maskName(profile.full_name),
        city: profile.province || "Việt Nam",
        points,
        orders: stats.orders,
        tier: tierForPoints(points),
        joinedAt: profile.created_at,
      };
    }).sort((a, b) => b.points - a.points).slice(0, 8);

    return apiResponse({ members, total: members.length, pointsNote: "Điểm hiển thị được tạm tính theo 1 điểm/1.000đ từ đơn đã xác nhận; hệ thống điểm chính thức sẽ do Hòa Phúc chốt." });
  } catch {
    return apiError("Danh sách hội viên chưa sẵn sàng.", 503);
  }
}
