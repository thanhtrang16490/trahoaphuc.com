import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return apiError("Vui lòng đăng nhập để xem điểm hội viên.", 401);

    const admin = createAdminClient();
    const [account, transactions, rewards, redemptions, checkins, todaySpin] = await Promise.all([
      admin.from("loyalty_accounts").select("points_balance, lifetime_earned, lifetime_redeemed, tier, updated_at").eq("user_id", authData.user.id).maybeSingle(),
      admin.from("loyalty_transactions").select("id, points, balance_after, transaction_type, description, created_at").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(20),
      admin.from("loyalty_rewards").select("id, code, title, description, points_cost, reward_type, coupon_code, stock").eq("is_active", true).order("points_cost"),
      admin.from("loyalty_redemptions").select("id, redemption_code, status, created_at, reward:loyalty_rewards(title, coupon_code)").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(20),
      admin.from("loyalty_checkins").select("checkin_date, streak_days, points").eq("user_id", authData.user.id).order("checkin_date", { ascending: false }).limit(1),
      admin.from("loyalty_transactions").select("id").eq("user_id", authData.user.id).eq("transaction_type", "earn").eq("reference_type", "spin").gte("created_at", new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()).limit(1),
    ]);
    const failure = [account, transactions, rewards, redemptions, checkins, todaySpin].find((result) => result.error)?.error;
    if (failure) return apiError("Chưa thể tải thông tin hội viên.", 503);

    return apiResponse({
      account: account.data ?? { points_balance: 0, lifetime_earned: 0, lifetime_redeemed: 0, tier: "new", updated_at: null },
      transactions: transactions.data ?? [],
      rewards: rewards.data ?? [],
      redemptions: redemptions.data ?? [],
      latestCheckin: checkins.data?.[0] ?? null,
      spinAvailable: !(todaySpin.data?.length),
    });
  } catch {
    return apiError("Thông tin hội viên chưa sẵn sàng.", 503);
  }
}
