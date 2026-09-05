import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

const statuses = ["new", "contacted", "qualified", "closed", "discarded"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context) return apiError("Bạn không có quyền truy cập khu vực quản trị.", 403);
  const body = await request.json().catch(() => ({}));
  if (!statuses.includes(body.status)) return apiError("Trạng thái lead không hợp lệ.", 422);
  const { id } = await params;
  const { data, error } = await context.admin.from("leads").update({ status: body.status }).eq("id", id).select("id, name, status").single();
  if (error) return apiError("Không thể cập nhật lead.", 503);
  return apiResponse(data);
}
