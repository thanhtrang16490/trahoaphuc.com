import { categories } from "@/data/categories";
import { apiOptions, apiResponse } from "@/lib/api-v1";

export function GET() {
  return apiResponse(categories);
}

export function OPTIONS() {
  return apiOptions();
}
