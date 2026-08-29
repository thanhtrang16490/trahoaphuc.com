"use client";

import { useEffect, useState } from "react";

type VisibilityState = {
  hidden: boolean;
};

export function useMobileScrollVisibility() {
  const [state, setState] = useState<VisibilityState>({ hidden: false });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY;
      const shouldHide = currentY > 56 && diff > 4;
      const shouldShow = diff < -4 || currentY < 20;

      setState((prev) => {
        if (shouldShow && prev.hidden) return { hidden: false };
        if (shouldHide && !prev.hidden) return { hidden: true };
        return prev;
      });

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
