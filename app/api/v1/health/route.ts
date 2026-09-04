import { apiOptions, apiResponse } from "@/lib/api-v1";

export function GET() {
  return apiResponse({ service: "hoaphuc-api", version: "v1", status: "ok" });
}

export function OPTIONS() {
  return apiOptions();
}
