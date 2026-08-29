"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkle, Trophy } from "@phosphor-icons/react";
import { addLoyaltyPoints, readLoyaltyPoints, subscribeLoyalty } from "@/components/loyalty-store";
import { useToast } from "@/components/toast";

const prizes = [
  { label: "Giảm 5%", color: "#f7b731" },
  { label: "Freeship", color: "#ff7a18" },
  { label: "Giảm 10%", color: "#ef476f" },
  { label: "Tặng quà", color: "#8bc34a" },
  { label: "Giảm 15%", color: "#8e44ad" },
  { label: "Mã bí mật", color: "#2d9cdb" },
];

export function LuckySpinClient() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("Sẵn sàng quay thưởng");
  const [points, setPoints] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const syncPoints = () => setPoints(readLoyaltyPoints());
    syncPoints();
    return subscribeLoyalty(syncPoints);
  }, []);

  const prizeCount = prizes.length;
  const sliceAngle = 360 / prizeCount;

  const selectedIndex = useMemo(() => {
    const normalized = ((rotation % 360) + 360) % 360;
    const pointerAngle = (360 - normalized + sliceAngle / 2) % 360;
    return Math.floor(pointerAngle / sliceAngle) % prizeCount;
  }, [rotation, prizeCount, sliceAngle]);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const winningIndex = Math.floor(Math.random() * prizeCount);
    const extraTurns = 5 + Math.floor(Math.random() * 2);
    const targetAngle = 360 * extraTurns + (360 - winningIndex * sliceAngle - sliceAngle / 2);

    setRotation(targetAngle);
    window.setTimeout(() => {
      setResult(`Bạn nhận được: ${prizes[winningIndex].label}`);
      const addedPoints = winningIndex === 1 ? 1500 : winningIndex === 3 ? 1000 : winningIndex === 0 ? 500 : winningIndex === 4 ? 300 : 100;
      const nextPoints = addLoyaltyPoints(addedPoints);
      setPoints(nextPoints);
      showToast({
        title: "Cộng điểm thành công",
        message: `+${addedPoints} điểm, số dư hiện tại ${nextPoints} điểm`,
      });
      setSpinning(false);
    }, 4200);
  };

  return (
    <>
      <section className="md:hidden">
        <div className="container">
          <div className="-mx-4 sticky top-0 z-40 border-b border-[rgba(15,77,50,0.08)] bg-[rgba(255,255,255,0.92)]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(15,77,50,0.12)] bg-white text-[var(--green-dark)] shadow-[0_10px_18px_rgba(15,77,50,0.08)]"
                aria-label="Quay lại trang chủ"
              >
                <ArrowLeft size={18} weight="bold" />
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Mini game</div>
                <div className="truncate text-[16px] font-semibold leading-tight text-[var(--green-dark)]">Vòng quay may mắn</div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="rounded-[30px] bg-[linear-gradient(180deg,#f2ffe0,#dff3ab)] p-4 shadow-[0_18px_40px_rgba(91,162,0,0.16)]">
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

              <p className="mt-3 text-[13px] leading-6 text-[var(--muted)]">
                Mỗi lượt quay mang đến ưu đãi may mắn và cộng điểm thưởng vào ví điểm của bạn. 1 điểm = 1 đồng, có thể
                dùng để đổi quà hoặc voucher.
              </p>

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
                disabled={spinning}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#0f4d32,#063b27)] text-[15px] font-semibold text-white shadow-[0_16px_32px_rgba(15,77,50,0.24)] disabled:opacity-70"
              >
                {spinning ? "Đang quay..." : "Quay ngay"}
              </button>

              <div className="mt-4 rounded-[20px] bg-white px-4 py-3 text-center text-[14px] font-semibold text-[var(--green-dark)] shadow-[0_10px_24px_rgba(15,77,50,0.08)]">
                {result}
              </div>

              <div className="mt-3 rounded-[20px] border border-[rgba(15,77,50,0.1)] bg-white/80 px-4 py-3 text-center">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Điểm thưởng</div>
                <div className="mt-1 text-[18px] font-semibold text-[var(--green-dark)]">
                  {points} điểm <span className="text-[12px] font-medium text-[var(--muted)]">(1 điểm = 1 đồng)</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-[18px] bg-white/80 p-3 text-[var(--green-dark)]">
                  <div className="font-semibold">Cách chơi</div>
                  <div className="mt-1 leading-5 text-[var(--muted)]">Bấm quay và chờ wheel dừng để nhận quà.</div>
                </div>
                <div className="rounded-[18px] bg-white/80 p-3 text-[var(--green-dark)]">
                  <div className="font-semibold">Áp dụng</div>
                  <div className="mt-1 leading-5 text-[var(--muted)]">Dùng ưu đãi trong giỏ hàng khi mua sắm.</div>
                </div>
              </div>

              <div className="mt-4 text-center text-[12px] text-[var(--muted)]">
                Vị trí hiện tại: <span className="font-semibold text-[var(--green-dark)]">{prizes[selectedIndex]?.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container hidden md:block section pt-10 md:pt-14">
        <div className="max-w-3xl">
          <div className="eyebrow text-[11px] md:text-xs">
            <span className="h-px w-8 bg-[var(--green)]" />
            Mini game
          </div>
          <h1 className="mt-4 section-title text-[clamp(2rem,5vw,4.6rem)]">Vòng quay may mắn</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-8 text-[var(--muted)] md:text-base">
            Mini game quay thưởng dành cho khách hàng Hòa Phúc, tạo cảm giác chơi vui, nhận quà nhanh và dẫn về ưu đãi sử dụng ngay.
          </p>
        </div>
      </section>
    </>
  );
}
