import { apiError, apiResponse } from "@/lib/api-v1";
import { vietnamProvinces } from "@/data/vietnam-address";

type RemoteWard = { code: number; name: string; division_type?: string; province_code?: number };
type RemoteProvince = { code: number; name: string; wards?: RemoteWard[] };

export async function GET() {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/v2/?depth=2", { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("Location API unavailable");
    const remote = (await response.json()) as RemoteProvince[];
    const data = remote.map((province) => ({ code: province.code, name: province.name.replace(/^(Tỉnh|Thành phố) /, ""), wards: (province.wards ?? []).map((ward) => ({ code: ward.code, name: ward.name })) }));
    return apiResponse(data);
  } catch {
    return apiResponse(vietnamProvinces.map((name, index) => ({ code: index + 1, name, wards: [] })));
  }
}
