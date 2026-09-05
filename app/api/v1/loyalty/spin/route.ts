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
    if (!authData.user) return apiError("Vui lòng đăng nhập để quay và nhận điểm.", 401);
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("award_spin_points", { p_user_id: authData.user.id });
    if (error) {
      if (error.message.startsWith("LOYALTY_SPIN_LIMIT")) return apiError("Bạn đã nhận điểm vòng quay hôm nay. Hẹn gặp lại ngày mai nhé!", 422);
      return apiError("Chưa thể cộng điểm vòng quay.", 503);
    }
    return apiResponse(data, { status: 201 });
  } catch {
    return apiError("Vòng quay chưa sẵn sàng.", 503);
  }
}
