"use client";

import { CircleNotch } from "@phosphor-icons/react";

export function LoadingState({ label = "Đang tải" }: { label?: string }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-6 py-16" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(15,77,50,0.08)] text-[var(--green)]">
          <CircleNotch size={24} weight="bold" className="animate-spin" />
        </span>
        <span className="text-sm font-semibold text-[var(--green-dark)]">{label}</span>
      </div>
    </div>
  );
}
