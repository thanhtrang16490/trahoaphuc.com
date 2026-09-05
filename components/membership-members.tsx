"use client";

import { useEffect, useState } from "react";

type Member = { name: string; city: string; points: number; orders: number; tier: string };

export function MembershipMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/members", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!payload?.ok) return;
        setMembers(Array.isArray(payload.data?.members) ? payload.data.members : []);
        setTotal(Number(payload.data?.total ?? 0));
        setNote(payload.data?.pointsNote ?? "");
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mt-4 text-[clamp(1.5rem,3vw,2.4rem)] font-semibold tracking-[-0.04em] text-[var(--green-dark)]">
        Cộng đồng hội viên Hòa Phúc
      </div>
      <p className="mt-3 text-[14px] leading-7 text-[var(--muted)]">
        {loading ? "Đang tải dữ liệu hội viên..." : `${total} tài khoản đang tham gia chương trình hội viên.`}
      </p>
      <div className="mt-6 space-y-3">
        {!loading && !members.length ? (
          <div className="rounded-[24px] bg-[rgba(15,77,50,0.04)] p-5 text-sm leading-7 text-[var(--muted)]">
            Chưa có hội viên đủ điều kiện hiển thị công khai. Hãy đăng ký tài khoản để trở thành thành viên đầu tiên.
          </div>
        ) : null}
        {members.map((member, index) => (
          <div key={`${member.name}-${index}`} className="flex items-center gap-3 rounded-[24px] border border-[rgba(15,77,50,0.08)] bg-[rgba(15,77,50,0.03)] p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(15,77,50,0.08)] text-[var(--green)]">
              <span className="text-[18px] font-semibold leading-none">◉</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-[15px] font-semibold text-[var(--green-dark)]">{member.name}</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brown)]">#{index + 1}</div>
              </div>
              <div className="mt-1 text-[12px] leading-5 text-[var(--muted)]">{member.city} · {member.orders} đơn</div>
              <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-[var(--green-dark)]"><span className="text-[11px]">✦</span>{member.tier}<span className="text-[rgba(15,77,50,0.22)]">|</span>{member.points.toLocaleString("vi-VN")} điểm</div>
            </div>
          </div>
        ))}
      </div>
      {note ? <p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">{note}</p> : null}
    </>
  );
}
