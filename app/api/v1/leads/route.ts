import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiResponse } from "@/lib/api-v1";
import { notifyTelegramLead, notifyTelegramSystem } from "@/lib/telegram";

const requiredFields = ["name", "phone", "area"] as const;

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = {
      name: text(body.name, 160),
      phone: text(body.phone, 40),
      area: text(body.area, 160),
      business_type: text(body.businessType, 120),
      scale: text(body.scale, 120),
      product_interest: text(body.productInterest, 120),
      sales_channel: text(body.salesChannel, 120),
      message: text(body.message, 1000),
      source: "agent_signup",
    };

    if (requiredFields.some((field) => !lead[field])) return apiError("Vui lòng điền họ tên, số điện thoại và khu vực.", 422);
    if (!/^(0|\+84)[0-9 .-]{8,12}$/.test(lead.phone)) return apiError("Số điện thoại chưa đúng định dạng.", 422);

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("leads").insert(lead).select("id, created_at").single();
    if (error || !data) {
      void notifyTelegramSystem({ title: "Không lưu được lead", detail: error?.message || "lead insert returned no data" });
      return apiError("Chưa thể ghi nhận đăng ký. Vui lòng thử lại sau.", 503);
    }

    void notifyTelegramLead({
      name: lead.name,
      phone: lead.phone,
      area: lead.area,
      businessType: lead.business_type,
      scale: lead.scale,
      productInterest: lead.product_interest,
      salesChannel: lead.sales_channel,
      message: lead.message,
    });

    return apiResponse(data, { status: 201 });
  } catch {
    return apiError("Dữ liệu đăng ký không hợp lệ.", 400);
  }
}
