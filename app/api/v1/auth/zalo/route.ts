import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}
import { signInWithZaloAccessToken } from "@/lib/zalo-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const accessToken = typeof body.accessToken === "string" ? body.accessToken.trim() : "";
  if (!accessToken) return apiError("Thiếu access token Zalo.", 422);

  try {
    return apiResponse(await signInWithZaloAccessToken(accessToken));
  } catch (error) {
    console.error("Zalo mini app sign-in failed", error);
    return apiError("Không thể xác thực tài khoản Zalo. Vui lòng thử lại trong ứng dụng Zalo.", 401);
  }
}
