"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 500);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          scrollToTop();
        }
      }}
      aria-label="Về đầu trang"
      title="Về đầu trang"
      className="group fixed right-[35px] bottom-[100px] z-50 hidden h-10 w-10 rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.28)] transition-all duration-300 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 motion-reduce:transition-none md:block"
    >
      <ArrowUp className="mx-auto h-5 w-5 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
    </button>
  );
}
