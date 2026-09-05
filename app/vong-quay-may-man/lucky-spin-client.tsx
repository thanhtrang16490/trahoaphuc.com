"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Gift, Info, Sparkle, Tag, Trophy } from "@phosphor-icons/react";
import { readAuthUser } from "@/components/auth-store";
import { useToast } from "@/components/toast";
import { MobileBackHeader } from "@/components/mobile-back-header";

const prizes = [
  { label: "Giảm 5%", code: "HOAPHUC5", points: 500, description: "Cho đơn hàng tiếp theo", color: "#f7b731" },
  { label: "Freeship", code: "FREESHIP200", points: 1500, description: "Cho đơn từ 200.000đ", color: "#ff7a18" },
  { label: "Giảm 10%", code: "HOAPHUC10", points: 100, description: "Cho đơn từ 1.000.000đ", color: "#ef476f" },
  { label: "Tặng voucher", code: "HOAPHUC100", points: 1000, description: "Giảm 100.000đ cho đơn từ 500.000đ", color: "#8bc34a" },
  { label: "Giảm 15%", code: "HOAPHUC15", points: 300, description: "Ưu đãi thành viên", color: "#8e44ad" },
  { label: "Mã bí mật", code: "HOAPHUCBI", points: 100, description: "Giảm 50.000đ cho đơn từ 300.000đ", color: "#2d9cdb" },
];

export function LuckySpinClient() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("Sẵn sàng quay thưởng");
  const [points, setPoints] = useState(0);
  const [spinAvailable, setSpinAvailable] = useState(true);
  const [wonPrize, setWonPrize] = useState<(typeof prizes)[number] | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/v1/loyalty", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => { if (payload?.ok) { setPoints(Number(payload.data?.account?.points_balance ?? 0)); setSpinAvailable(payload.data?.spinAvailable !== false); } })
      .catch(() => undefined);
  }, []);

  const prizeCount = prizes.length;
  const sliceAngle = 360 / prizeCount;

  const selectedIndex = useMemo(() => {
    const normalized = ((rotation % 360) + 360) % 360;
    const pointerAngle = (360 - normalized + sliceAngle / 2) % 360;
    return Math.floor(pointerAngle / sliceAngle) % prizeCount;
  }, [rotation, prizeCount, sliceAngle]);

  const spinWheel = () => {
    if (spinning || !spinAvailable) {
      if (!spinAvailable) setResult("Bạn đã hết lượt quay hôm nay. Hẹn gặp lại ngày mai nhé!");
      return;
    }
    if (!readAuthUser()) {
      setResult("Vui lòng đăng nhập để nhận điểm thưởng.");
      return;
    }
    setSpinning(true);

    const winningIndex = Math.floor(Math.random() * prizeCount);
    const extraTurns = 5 + Math.floor(Math.random() * 2);
    const targetAngle = 360 * extraTurns + (360 - winningIndex * sliceAngle - sliceAngle / 2);

    setRotation(targetAngle);
    window.setTimeout(() => {
      const prize = prizes[winningIndex];
      setWonPrize(prize);
      setResult(`Bạn nhận được: ${prize.label}`);
      fetch("/api/v1/loyalty/spin", { method: "POST" })
        .then((response) => response.json().then((payload) => ({ response, payload })))
        .then(({ response, payload }) => {
          if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || "Chưa thể cộng điểm.");
          const addedPoints = Number(payload.data?.points ?? 0);
          const nextPoints = Number(payload.data?.balance ?? 0);
          setPoints(nextPoints);
          setSpinAvailable(false);
          showToast({ title: "Cộng điểm thành công", message: `+${addedPoints} điểm, số dư hiện tại ${nextPoints} điểm` });
        })
        .catch((error) => { setSpinAvailable(false); setResult(error instanceof Error ? error.message : "Chưa thể cộng điểm thưởng."); })
        .finally(() => setSpinning(false));
    }, 4200);
  };

  const copyRewardCode = async () => {
    if (!wonPrize) return;
    await navigator.clipboard?.writeText(wonPrize.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <MobileBackHeader href="/" section="Mini game" title="Vòng quay may mắn" />
      <section>
        <div className="container py-4 md:py-14">
          <div className="pt-4">
            <div className="mx-auto max-w-2xl rounded-[30px] bg-[linear-gradient(180deg,#f2ffe0,#dff3ab)] p-4 shadow-[0_18px_40px_rgba(91,162,0,0.16)] md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-[var(--green)] shadow-[0_10px_22px_rgba(15,77,50,0.08)]">
                  <Trophy size={26} weight="fill" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Quay thưởng</div>
                  <h1 className="mt-1 text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--green-dark)]">
                    Quay để nhận ưu đãi
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-[58ch] text-[13px] leading-6 text-[var(--muted)] md:text-sm">
                Mỗi lượt quay mang đến một ưu đãi may mắn và điểm thưởng vào ví của bạn. Nhận mã xong, bạn có thể dùng ngay trong giỏ hàng.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[16px] bg-white/75 px-2 py-2.5"><div className="text-[16px] font-semibold text-[var(--green-dark)]">6</div><div className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Phần quà</div></div>
                <div className="rounded-[16px] bg-white/75 px-2 py-2.5"><div className="text-[16px] font-semibold text-[var(--green-dark)]">1</div><div className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Lượt quay</div></div>
                <div className="rounded-[16px] bg-white/75 px-2 py-2.5"><div className="text-[16px] font-semibold text-[var(--green-dark)]">100%</div><div className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Cơ hội nhận quà</div></div>
              </div>

              <div className="mt-5 flex justify-center">
                <div className="relative h-[290px] w-[290px]">
                  <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                    <div className="h-0 w-0 border-x-[12px] border-x-transparent border-b-[18px] border-b-[var(--green-dark)] drop-shadow-[0_6px_10px_rgba(15,77,50,0.18)]" />
                  </div>
                  <div
                    className="absolute inset-0 rounded-full border-[10px] border-white shadow-[0_18px_44px_rgba(15,77,50,0.16)] transition-transform duration-[4200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {prizes.map((prize, index) => {
                      const startAngle = index * sliceAngle;
                      return (
                        <div
                          key={prize.label}
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(from ${startAngle}deg, ${prize.color} 0deg ${sliceAngle}deg, transparent 0deg ${sliceAngle}deg)`,
                            clipPath: "circle(50% at 50% 50%)",
                          }}
                        >
                          <div
                            className="absolute left-1/2 top-1/2 flex w-[46%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center text-[11px] font-semibold leading-[1.1] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]"
                            style={{ transform: `translate(-50%, -50%) rotate(${startAngle + sliceAngle / 2}deg)` }}
                          >
                            <span>{prize.label}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="absolute inset-[22%] rounded-full border border-white/70 bg-white shadow-[inset_0_0_0_1px_rgba(15,77,50,0.06)]">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffffff,#f7fbef)]">
                        <Sparkle size={22} weight="fill" className="text-[var(--green)]" />
                        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green-dark)]">Hòa Phúc</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={spinWheel}
                disabled={spinning || !spinAvailable}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#0f4d32,#063b27)] text-[15px] font-semibold text-white shadow-[0_16px_32px_rgba(15,77,50,0.24)] disabled:opacity-70"
              >
                {spinning ? "Đang quay..." : !spinAvailable ? "Đã hết lượt hôm nay" : wonPrize ? "Quay lại lần nữa" : "Quay ngay"}
              </button>

              <div aria-live="polite" className="mt-4 rounded-[20px] bg-white px-4 py-3 text-center text-[14px] font-semibold text-[var(--green-dark)] shadow-[0_10px_24px_rgba(15,77,50,0.08)]">
                {result}
              </div>

              {wonPrize ? (
                <div className="mt-3 rounded-[22px] border border-[rgba(15,77,50,0.12)] bg-white p-4 shadow-[0_12px_28px_rgba(15,77,50,0.1)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(15,77,50,0.08)] text-[var(--green)]"><Gift size={23} weight="duotone" /></div>
                    <div className="min-w-0 flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--green)]">Mã quà của bạn</div><div className="mt-1 text-lg font-semibold text-[var(--green-dark)]">{wonPrize.label}</div><div className="text-xs text-[var(--muted)]">{wonPrize.description}</div></div>
                    <Check size={20} weight="bold" className="text-[var(--green)]" />
                  </div>
                  <button type="button" onClick={() => void copyRewardCode()} className="mt-3 flex w-full items-center justify-between rounded-[14px] border border-dashed border-[rgba(15,77,50,0.22)] bg-[rgba(15,77,50,0.04)] px-3 py-2.5 text-left"><span className="font-mono text-sm font-semibold tracking-[0.12em] text-[var(--green-dark)]">{wonPrize.code}</span><span className="flex items-center gap-1 text-xs font-semibold text-[var(--green)]">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Đã sao chép" : "Sao chép"}</span></button>
                  <Link href="/san-pham" className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--green)]">Dùng mã khi mua sắm <ArrowRight size={16} /></Link>
                </div>
              ) : null}

              <div className="mt-3 rounded-[20px] border border-[rgba(15,77,50,0.1)] bg-white/80 px-4 py-3 text-center">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Điểm thưởng</div>
                <div className="mt-1 text-[18px] font-semibold text-[var(--green-dark)]">
                  {points} điểm <span className="text-[12px] font-medium text-[var(--muted)]">(1 điểm = 1 đồng)</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-[18px] bg-white/80 p-3 text-[var(--green-dark)]">
                  <div className="flex items-center gap-2 font-semibold"><Info size={16} weight="bold" /> Cách chơi</div>
                  <div className="mt-1 leading-5 text-[var(--muted)]">Bấm quay, chờ vòng quay dừng và nhận mã.</div>
                </div>
                <div className="rounded-[18px] bg-white/80 p-3 text-[var(--green-dark)]">
                  <div className="flex items-center gap-2 font-semibold"><Tag size={16} weight="bold" /> Áp dụng</div>
                  <div className="mt-1 leading-5 text-[var(--muted)]">Nhập mã tại giỏ hàng khi thanh toán.</div>
                </div>
              </div>

              <div className="mt-4 text-center text-[12px] text-[var(--muted)]">
                Vị trí hiện tại: <span className="font-semibold text-[var(--green-dark)]">{prizes[selectedIndex]?.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
