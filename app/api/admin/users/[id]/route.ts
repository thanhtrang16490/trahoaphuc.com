import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

const roles = ["customer", "dealer", "staff", "editor", "admin"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context || context.role !== "admin") return apiError("Chỉ admin mới có thể quản lý vai trò tài khoản.", 403);
  const body = await request.json().catch(() => ({}));
  const { id } = await params;
  if (id === context.user.id && body.is_active === false) return apiError("Không thể tự khóa tài khoản admin đang đăng nhập.", 422);
  const { data: existingRole } = await context.admin.from("user_roles").select("role").eq("user_id", id).maybeSingle();
  const role = body.role ?? existingRole?.role ?? "customer";
  if (id === context.user.id && role !== "admin") return apiError("Không thể tự hạ quyền admin đang đăng nhập.", 422);
  if (!roles.includes(role)) return apiError("Vai trò tài khoản không hợp lệ.", 422);
  const isActive = body.is_active === undefined ? true : body.is_active === true || body.is_active === "true";
  const { data, error } = await context.admin.from("user_roles").upsert({ user_id: id, role, granted_by: context.user.id }).select("user_id, role").single();
  if (error) return apiError("Không thể cập nhật vai trò tài khoản.", 503);
  const profileFields = {
    account_type: role === "dealer" ? "dealer" : "customer",
    is_active: isActive,
    full_name: typeof body.full_name === "string" ? body.full_name.trim() : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
    province: typeof body.province === "string" ? body.province.trim() : undefined,
  };
  const { error: profileError } = await context.admin.from("profiles").update(profileFields).eq("id", id);
  if (profileError) return apiError("Vai trò đã cập nhật nhưng hồ sơ chưa đồng bộ.", 503);
  if (role === "dealer") await context.admin.from("dealer_profiles").upsert({ user_id: id, status: "pending" }, { onConflict: "user_id" });
  return apiResponse(data);
}
