import "server-only";

import { couponCatalog, type CouponCatalog } from "@/data/coupons";
import { createClient } from "@/lib/supabase/server";

type CouponRow = {
  code: string;
  label: string;
  discount_type: "percent" | "fixed" | "shipping";
  discount_value: number | string;
  min_subtotal_vnd: number | string;
  note: string;
  source: string;
};

function localCoupons() {
  return couponCatalog;
}

export async function getCoupons(): Promise<CouponCatalog> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("code, label, discount_type, discount_value, min_subtotal_vnd, note, source")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return Object.fromEntries(
      ((data ?? []) as CouponRow[]).map((coupon) => [
        coupon.code,
        {
          label: coupon.label,
          type: coupon.discount_type,
          value: coupon.discount_type === "percent" ? Number(coupon.discount_value) / 100 : Number(coupon.discount_value),
          minSubtotal: Number(coupon.min_subtotal_vnd),
          note: coupon.note,
          source: coupon.source,
        },
      ]),
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[coupons] Supabase coupons unavailable; using local fallback.",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
    return localCoupons();
  }
}
