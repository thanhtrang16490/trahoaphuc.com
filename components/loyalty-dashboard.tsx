"use client";

import { useEffect, useState } from "react";
import { Gift, Sparkle, Ticket } from "@phosphor-icons/react";
import { useToast } from "@/components/toast";

type LoyaltyData = {
  account: { points_balance: number; lifetime_earned: number; lifetime_redeemed: number; tier: string };
  rewards: Array<{ id: string; title: string; description: string; points_cost: number; coupon_code?: string | null; stock?: number | null }>;
  redemptions: Array<{ id: string; redemption_code: string; status: string; created_at: string; reward?: { title?: string; coupon_code?: string | null } | null }>;
  transactions: Array<{ id: string; points: number; description: string; created_at: string }>;
  latestCheckin: { checkin_date: string; streak_days: number; points: number } | null;
};

const tierLabels: Record<string, string> = { new: "Thành viên mới", member: "Hội viên thân thiết", gold: "Hội viên vàng" };

export function LoyaltyDashboard({ userId }: { userId?: string }) {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    if (!userId) { setData(null); return; }
    setLoading(true);
    fetch("/api/v1/loyalty", { cache: "no-store" })
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => { if (response.ok && payload?.ok) setData(payload.data); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [userId]);

  const redeem = async (rewardId: string) => {
    setRedeeming(rewardId);
    try {
      const response = await fetch("/api/v1/loyalty/redeem", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ rewardId }) });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Chưa thể đổi quà.");
      showToast({ title: "Đổi quà thành công", message: payload.data.coupon_code ? `Mã coupon: ${payload.data.coupon_code}` : `Mã nhận quà: ${payload.data.redemption_code}` });
      load();
    } catch (error) {
      showToast({ title: "Chưa thể đổi quà", message: error instanceof Error ? error.message : "Vui lòng thử lại." });
    } finally {
      setRedeeming(null);
    }
  };

  const checkIn = async () => {
    setCheckingIn(true);
    try {
      const response = await fetch("/api/v1/loyalty/checkin", { method: "POST" });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Chưa thể điểm danh.");
      showToast({ title: "Điểm danh thành công", message: `+${payload.data.points} điểm · Chuỗi ${payload.data.streak_days} ngày` });
      load();
    } catch (error) {
      showToast({ title: "Chưa thể điểm danh", message: error instanceof Error ? error.message : "Vui lòng thử lại." });
    } finally {
      setCheckingIn(false);
    }
  };

  if (!userId) return null;
  if (loading && !data) return <section className="mt-4 h-36 animate-pulse rounded-[22px] bg-[rgba(15,77,50,0.08)]" />;
  if (!data) return null;

  return (
    <section className="mt-4 rounded-[22px] border border-[rgba(15,77,50,0.08)] bg-white p-4 shadow-[0_10px_24px_rgba(15,77,50,0.06)] md:mt-6 md:rounded-[32px] md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Hội viên thật</div><h2 className="mt-2 text-[22px] font-semibold text-[var(--green-dark)] md:text-3xl">Điểm & đổi quà</h2></div>
        <div className="rounded-[16px] bg-[rgba(15,77,50,0.06)] px-3 py-2 text-right"><div className="text-[11px] text-[var(--muted)]">Số dư</div><div className="text-lg font-semibold text-[var(--green-dark)]">{data.account.points_balance.toLocaleString("vi-VN")} điểm</div></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center md:grid-cols-4 md:gap-3"><div className="rounded-[16px] bg-[rgba(15,77,50,0.04)] p-3"><div className="text-[11px] text-[var(--muted)]">Hạng hiện tại</div><div className="mt-1 text-sm font-semibold text-[var(--green-dark)]">{tierLabels[data.account.tier] || data.account.tier}</div></div><div className="rounded-[16px] bg-[rgba(15,77,50,0.04)] p-3"><div className="text-[11px] text-[var(--muted)]">Đã tích lũy</div><div className="mt-1 text-sm font-semibold text-[var(--green-dark)]">{data.account.lifetime_earned.toLocaleString("vi-VN")}</div></div><div className="rounded-[16px] bg-[rgba(15,77,50,0.04)] p-3"><div className="text-[11px] text-[var(--muted)]">Đã đổi</div><div className="mt-1 text-sm font-semibold text-[var(--green-dark)]">{data.account.lifetime_redeemed.toLocaleString("vi-VN")}</div></div><div className="rounded-[16px] bg-[rgba(15,77,50,0.04)] p-3"><div className="text-[11px] text-[var(--muted)]">Giao dịch</div><div className="mt-1 text-sm font-semibold text-[var(--green-dark)]">{data.transactions.length}</div></div></div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-[linear-gradient(90deg,#effbd9,#f9f4d8)] p-3"><div><div className="text-sm font-semibold text-[var(--green-dark)]">Chuỗi đăng nhập {data.latestCheckin?.streak_days ?? 0} ngày</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">Điểm danh mỗi ngày để nhận từ 20 đến 50 điểm.</div></div><button type="button" onClick={() => void checkIn()} disabled={checkingIn} className="inline-flex h-10 items-center gap-2 rounded-[13px] bg-[var(--green)] px-4 text-xs font-semibold text-white disabled:opacity-50"><Sparkle size={15} />{checkingIn ? "Đang nhận..." : "Điểm danh hôm nay"}</button></div>
      <div className="mt-5"><div className="flex items-center gap-2 text-sm font-semibold text-[var(--green-dark)]"><Gift size={18} className="text-[var(--green)]" /> Phần thưởng có thể đổi</div><div className="mt-3 grid gap-3 md:grid-cols-3">{data.rewards.map((reward) => <div key={reward.id} className="rounded-[18px] border border-[rgba(15,77,50,0.1)] p-3"><div className="flex items-start gap-2"><Ticket size={18} className="mt-0.5 shrink-0 text-[var(--green)]" /><div className="min-w-0"><div className="text-sm font-semibold text-[var(--green-dark)]">{reward.title}</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">{reward.description}</div></div></div><button type="button" onClick={() => void redeem(reward.id)} disabled={redeeming === reward.id || data.account.points_balance < reward.points_cost || reward.stock === 0} className="mt-3 flex h-9 w-full items-center justify-center gap-1 rounded-[12px] bg-[var(--green)] px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"><Sparkle size={14} />{redeeming === reward.id ? "Đang đổi..." : `${reward.points_cost.toLocaleString("vi-VN")} điểm`}</button></div>)}</div></div>
      {data.redemptions.length ? <div className="mt-5 border-t border-[rgba(15,77,50,0.08)] pt-4"><div className="text-sm font-semibold text-[var(--green-dark)]">Mã đã đổi gần đây</div><div className="mt-2 space-y-2">{data.redemptions.slice(0, 3).map((redemption) => <div key={redemption.id} className="flex items-center justify-between gap-3 rounded-[14px] bg-[rgba(15,77,50,0.04)] px-3 py-2 text-xs"><span className="font-mono font-semibold text-[var(--green-dark)]">{redemption.reward?.coupon_code || redemption.redemption_code}</span><span className="text-right text-[var(--muted)]">{redemption.reward?.title || "Phần thưởng"}<br /><span className="text-[10px]">Mã nhận: {redemption.redemption_code}</span></span></div>)}</div></div> : null}
    </section>
  );
}
