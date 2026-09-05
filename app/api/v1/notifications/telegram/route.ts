import { createClient } from "@/lib/supabase/server";
import { apiError, apiResponse } from "@/lib/api-v1";
import { notifyTelegramAccount } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return apiError("Phiên đăng nhập không hợp lệ.", 401);

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const sent = await notifyTelegramAccount({ id: data.user.id, name, phone, email: data.user.email ?? "" });
    return apiResponse({ sent });
  } catch {
    return apiError("Không thể gửi thông báo tài khoản.", 503);
  }
}
