"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useId } from "react";

type ModalShellProps = {
  eyebrow?: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function ModalShell({ eyebrow, title, onClose, children, className = "" }: ModalShellProps) {
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end bg-[rgba(6,31,20,0.46)] p-0 backdrop-blur-[3px] motion-safe:animate-[modal-backdrop-in_220ms_ease-out] md:items-center md:p-4" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[min(88dvh,760px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-white/70 bg-[var(--surface-strong)] shadow-[0_-20px_70px_rgba(6,31,20,0.22)] motion-safe:animate-[sheet-in_320ms_cubic-bezier(0.22,1,0.36,1)] md:rounded-[28px] ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[rgba(15,77,50,0.08)] px-5 pb-4 pt-3 md:pt-5">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[rgba(15,77,50,0.16)] md:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {eyebrow ? <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green)]">{eyebrow}</div> : null}
              <h2 id={titleId} className="mt-1 text-2xl font-semibold text-[var(--green-dark)]">{title}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label={`Đóng ${title.toLowerCase()}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(15,77,50,0.06)] text-[var(--green-dark)] transition-transform active:scale-95">
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">{children}</div>
      </section>
    </div>
  );
}
