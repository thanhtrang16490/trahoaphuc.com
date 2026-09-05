import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

const statuses = ["draft", "published", "archived"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền cập nhật bài viết.", 403);
  const body = await request.json().catch(() => ({}));
  if (!statuses.includes(body.status)) return apiError("Trạng thái bài viết không hợp lệ.", 422);
  const { id } = await params;
  const { data, error } = await context.admin.from("news_posts").update({ status: body.status, published_at: body.status === "published" ? new Date().toISOString().slice(0, 10) : null }).eq("id", id).select("id, title, status").single();
  if (error) return apiError("Không thể cập nhật bài viết.", 503);
  return apiResponse(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền xóa bài viết.", 403);
  const { id } = await params;
  const { data, error } = await context.admin.from("news_posts").update({ status: "archived" }).eq("id", id).select("id, title, status").single();
  if (error) return apiError("Không thể lưu trữ bài viết.", 503);
  return apiResponse(data);
}
