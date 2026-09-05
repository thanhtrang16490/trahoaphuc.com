import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return apiError("Vui lòng đăng nhập để điểm danh.", 401);
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("claim_daily_loyalty_checkin", { p_user_id: authData.user.id });
    if (error) {
      if (error.message.startsWith("LOYALTY_CHECKIN_CLAIMED")) return apiError("Bạn đã nhận điểm hôm nay. Hãy quay lại vào ngày mai nhé!", 422);
      return apiError("Chưa thể nhận điểm danh hôm nay.", 503);
    }
    return apiResponse(data, { status: 201 });
  } catch {
    return apiError("Điểm danh chưa sẵn sàng.", 503);
  }
}
