import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { rewardId?: unknown } | null;
  const rewardId = typeof body?.rewardId === "string" ? body.rewardId : "";
  if (!rewardId) return apiError("Phần thưởng không hợp lệ.", 422);

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return apiError("Vui lòng đăng nhập để đổi quà.", 401);

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("redeem_loyalty_reward", { p_user_id: authData.user.id, p_reward_id: rewardId });
    if (error) {
      const code = error.message.split(" ")[0];
      const messages: Record<string, string> = {
        LOYALTY_REWARD_NOT_FOUND: "Phần thưởng không còn khả dụng.",
        LOYALTY_REWARD_EXHAUSTED: "Phần thưởng đã hết lượt đổi.",
        LOYALTY_POINTS_INSUFFICIENT: "Bạn chưa đủ điểm để đổi phần thưởng này.",
      };
      return apiError(messages[code] || "Chưa thể đổi phần thưởng.", 422);
    }
    return apiResponse(data, { status: 201 });
  } catch {
    return apiError("Hệ thống đổi quà chưa sẵn sàng.", 503);
  }
}
