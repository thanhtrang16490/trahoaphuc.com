import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

const text = (body: Record<string, unknown>, key: string, max = 1000) => typeof body[key] === "string" ? body[key].trim().slice(0, max) : "";

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền tạo bài viết.", 403);
  const body = await request.json().catch(() => ({}));
  const post = { slug: text(body, "slug", 160).toLowerCase(), title: text(body, "title", 220), excerpt: text(body, "excerpt"), category: text(body, "category", 100), read_time: text(body, "read_time", 40), cover_image: text(body, "cover_image", 300), content: Array.isArray(body.content) ? body.content.filter((item: unknown): item is string => typeof item === "string").slice(0, 30) : [], status: body.status === "draft" ? "draft" : "published", published_at: body.status === "draft" ? null : new Date().toISOString().slice(0, 10), author_id: context.user.id };
  if (!post.slug || !post.title) return apiError("Slug và tiêu đề là bắt buộc.", 422);
  const { data, error } = await context.admin.from("news_posts").insert(post).select("id, slug, title, status").single();
  if (error) return apiError("Không thể tạo bài viết.", 503);
  return apiResponse(data, { status: 201 });
}
