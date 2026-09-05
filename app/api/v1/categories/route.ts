import { apiOptions, apiResponse } from "@/lib/api-v1";
import { getCategories } from "@/lib/catalog";

export async function GET() {
  const categories = await getCategories();
  return apiResponse(categories);
}

export function OPTIONS() {
  return apiOptions();
}
