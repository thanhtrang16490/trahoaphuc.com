import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { apiError, apiResponse } from "@/lib/api-v1";
import { notifyTelegramLogin } from "@/lib/telegram";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!identifier || !password) return apiError("Vui lòng nhập thông tin đăng nhập.", 422);

  try {
    let email = identifier.toLowerCase();
    if (!email.includes("@")) {
      const admin = createAdminClient();
      const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const matched = listed.data.users.find((user) => String(user.user_metadata?.username ?? "").toLowerCase() === email);
      if (!matched?.email) return apiError("Thông tin đăng nhập không chính xác.", 401);
      email = matched.email;
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return apiError("Thông tin đăng nhập không chính xác.", 401);
    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("is_active").eq("id", data.user.id).maybeSingle();
    if (profile && !profile.is_active) {
      await supabase.auth.signOut();
      return apiError("Tài khoản đã bị khóa. Vui lòng liên hệ Hòa Phúc để được hỗ trợ.", 403);
    }
    const { data: roleData } = await admin.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
    const role = roleData?.role ?? "customer";
    void notifyTelegramLogin({
      id: data.user.id,
      name: String(data.user.user_metadata?.name ?? ""),
      email: data.user.email ?? email,
      username: String(data.user.user_metadata?.username ?? ""),
      userAgent: request.headers.get("user-agent") ?? "",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "",
    });
    return apiResponse({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name ?? "", phone: data.user.user_metadata?.phone ?? "", username: data.user.user_metadata?.username ?? "", role });
  } catch {
    return apiError("Hệ thống đăng nhập chưa sẵn sàng.", 503);
  }
}
