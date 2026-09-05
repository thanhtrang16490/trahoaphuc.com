import { apiOptions, apiResponse } from "@/lib/api-v1";
import { getCoupons } from "@/lib/coupons";

export async function GET() {
  const coupons = await getCoupons();
  return apiResponse(
    Object.entries(coupons).map(([code, offer]) => ({ code, ...offer })),
  );
}

export function OPTIONS() {
  return apiOptions();
}
