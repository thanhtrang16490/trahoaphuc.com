"use client";

import { useRef } from "react";

export function Hero3D() {
  const boxRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] [perspective:1400px]">
      <div
        ref={boxRef}
        className="relative h-full w-full will-change-transform"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
          const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 16;
          event.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }}
        onMouseLeave={() => {
          if (boxRef.current) {
            boxRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
          }
        }}
        style={{ transformStyle: "preserve-3d", transition: "transform 180ms ease-out" }}
      >
        <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.7),rgba(255,255,255,0.12)_34%,rgba(17,44,31,0.03)_68%)] shadow-[0_30px_100px_rgba(21,46,34,0.18)]" />
        <div className="absolute inset-[9%] rounded-[28px] border border-white/55 bg-[linear-gradient(180deg,#dcc08a_0%,#c89d57_100%)] [transform:translateZ(40px)]">
          <div className="absolute inset-x-0 top-0 h-[14%] rounded-t-[28px] bg-[linear-gradient(180deg,rgba(4,47,31,0.96),rgba(15,77,50,0.96))]" />
          <div className="absolute inset-x-[27%] top-[9%] h-[14%] rounded-b-[22px] bg-[linear-gradient(180deg,#0f4d32,#1f6b45)] shadow-[0_20px_30px_rgba(0,0,0,0.14)]" />
          <div className="absolute inset-x-[10%] top-[28%] text-center text-[var(--green-dark)]">
            <div className="text-[clamp(1.8rem,4vw,3.5rem)] font-bold uppercase leading-none tracking-[0.06em]">Trà</div>
            <div className="mt-2 text-[clamp(2rem,4.4vw,4.25rem)] font-bold uppercase leading-[0.92] tracking-[0.05em]">
              Dưỡng Tâm
              <br />
              An Nhiên
            </div>
            <div className="mx-auto mt-3 max-w-[18rem] text-sm italic text-[#f7f1e9]/95">
              Hương vị thanh lành từ vùng đất Cố Đô
            </div>
          </div>
          <div className="absolute inset-x-[8%] bottom-[6%] h-[31%] rounded-[22px] bg-[radial-gradient(circle_at_50%_20%,rgba(129,190,121,0.95),rgba(29,103,59,0.98)_52%,rgba(6,59,39,1)_100%)]" />
          <div className="absolute inset-x-[18%] bottom-[7%] h-[18%] rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))] blur-[6px]" />
          <div className="absolute inset-x-[18%] bottom-[9%] text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
            Premium Herb Box
          </div>
        </div>
        <div className="absolute -left-[2%] top-[14%] h-[76%] w-[24%] rounded-[24px] bg-[linear-gradient(180deg,#e5cb9d,#c79954)] shadow-[0_26px_45px_rgba(16,41,29,0.16)] [transform:translateZ(8px)_rotateY(20deg)]" />
        <div className="absolute -right-[2%] top-[14%] h-[76%] w-[24%] rounded-[24px] bg-[linear-gradient(180deg,#e5cb9d,#c79954)] shadow-[0_26px_45px_rgba(16,41,29,0.16)] [transform:translateZ(8px)_rotateY(-20deg)]" />
        <div className="absolute inset-x-[12%] bottom-[3%] h-[10%] rounded-full bg-[rgba(18,44,31,0.16)] blur-2xl" />
        <div className="absolute left-[8%] top-[12%] h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(216,183,123,0.05))] blur-[2px] [transform:translateZ(60px)]" />
        <div className="absolute right-[14%] top-[22%] h-10 w-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.78),rgba(255,255,255,0))] blur-sm [transform:translateZ(52px)]" />
      </div>
    </div>
  );
}
