import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

const roles = ["customer", "dealer", "staff", "editor", "admin"];

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể tạo tài khoản.", 403);
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = typeof body.role === "string" ? body.role : "customer";
  if (!email || !email.includes("@")) return apiError("Email không hợp lệ.", 422);
  if (password.length < 8) return apiError("Mật khẩu phải có ít nhất 8 ký tự.", 422);
  if (!roles.includes(role)) return apiError("Vai trò tài khoản không hợp lệ.", 422);

  try {
    const { data, error } = await context.admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: typeof body.full_name === "string" ? body.full_name.trim() : "",
        phone: typeof body.phone === "string" ? body.phone.trim() : "",
        province: typeof body.province === "string" ? body.province.trim() : "",
      },
    });
    if (error || !data.user) return apiError(error?.message || "Không thể tạo tài khoản.", 422);

    const isActive = body.is_active !== false && body.is_active !== "false";
    const { error: roleError } = await context.admin.from("user_roles").upsert({ user_id: data.user.id, role, granted_by: context.user.id });
    const { error: profileError } = await context.admin.from("profiles").update({
      email,
      full_name: typeof body.full_name === "string" ? body.full_name.trim() : "",
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
      province: typeof body.province === "string" ? body.province.trim() : "",
      account_type: role === "dealer" ? "dealer" : "customer",
      is_active: isActive,
    }).eq("id", data.user.id);
    if (roleError || profileError) {
      await context.admin.auth.admin.deleteUser(data.user.id);
      return apiError("Không thể đồng bộ hồ sơ và vai trò tài khoản.", 503);
    }
    return apiResponse({ id: data.user.id, email, role });
  } catch {
    return apiError("Hệ thống quản trị tài khoản chưa sẵn sàng.", 503);
  }
}
