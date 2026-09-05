import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

export async function GET() {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể quản lý hội viên.", 403);
  const [members, rewards] = await Promise.all([
    context.admin.from("loyalty_accounts").select("user_id, points_balance, lifetime_earned, lifetime_redeemed, tier, updated_at, profiles(full_name, email, phone, account_type)").order("points_balance", { ascending: false }),
    context.admin.from("loyalty_rewards").select("id, code, title, description, points_cost, reward_type, coupon_code, stock, is_active, updated_at").order("points_cost"),
  ]);
  if (members.error || rewards.error) return apiError("Chưa thể tải dữ liệu hội viên.", 503);
  return apiResponse({ members: members.data ?? [], rewards: rewards.data ?? [] });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể điều chỉnh điểm.", 403);
  const body = await request.json().catch(() => ({}));
  const userId = typeof body.user_id === "string" ? body.user_id : "";
  const points = Number(body.points);
  const description = typeof body.description === "string" ? body.description : "Điều chỉnh điểm bởi quản trị viên";
  if (!userId || !Number.isInteger(points) || points === 0 || Math.abs(points) > 1000000) return apiError("Số điểm điều chỉnh không hợp lệ.", 422);
  const { data, error } = await context.admin.rpc("adjust_loyalty_points", { p_user_id: userId, p_points: points, p_description: description });
  if (error) {
    if (error.message.includes("LOYALTY_BALANCE_NEGATIVE")) return apiError("Số điểm sau điều chỉnh không thể nhỏ hơn 0.", 422);
    return apiError("Không thể điều chỉnh điểm hội viên.", 503);
  }
  return apiResponse(data);
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể cập nhật phần thưởng.", 403);
  const body = await request.json().catch(() => ({}));
  const rewardId = typeof body.reward_id === "string" ? body.reward_id : "";
  const updates: Record<string, boolean | number | null> = {};
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (body.stock === null || (Number.isInteger(body.stock) && body.stock >= 0)) updates.stock = body.stock;
  if (Number.isInteger(body.points_cost) && body.points_cost > 0) updates.points_cost = body.points_cost;
  if (!rewardId || !Object.keys(updates).length) return apiError("Dữ liệu phần thưởng không hợp lệ.", 422);
  const { data, error } = await context.admin.from("loyalty_rewards").update(updates).eq("id", rewardId).select("id, code, title, points_cost, stock, is_active").single();
  if (error) return apiError("Không thể cập nhật phần thưởng.", 503);
  return apiResponse(data);
}
