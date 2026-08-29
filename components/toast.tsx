"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ToastInput = {
  title: string;
  message?: string;
};

type ToastItem = ToastInput & {
  id: number;
  closing: boolean;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, closing: false, ...toast }]);

    window.setTimeout(() => {
      setToasts((items) => items.map((item) => (item.id === id ? { ...item, closing: true } : item)));
    }, 1900);

    window.setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 md:top-6">
        <div className="flex w-full max-w-sm flex-col gap-2 md:items-center">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-[22px] border border-[rgba(15,77,50,0.14)] bg-[rgba(255,255,255,0.9)] px-4 py-3 shadow-[0_18px_40px_rgba(15,77,50,0.16)] backdrop-blur-xl transition-all duration-300 ease-out motion-safe:will-change-transform ${
                toast.closing
                  ? "translate-y-2 scale-[0.98] opacity-0"
                  : "translate-y-0 scale-100 opacity-100 animate-[toast-in_380ms_cubic-bezier(0.22,1,0.36,1)]"
              }`}
            >
              <div className="text-sm font-semibold text-[var(--green-dark)]">{toast.title}</div>
              {toast.message ? <div className="mt-1 text-xs leading-6 text-[var(--muted)]">{toast.message}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
