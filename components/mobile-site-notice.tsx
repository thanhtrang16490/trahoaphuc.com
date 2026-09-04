"use client";

import { Info, X } from "@phosphor-icons/react";
import { useState } from "react";

export function MobileSiteNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-[#ead9ad] bg-[#fff8e7] text-[#684d18] md:hidden" role="status">
      <div className="mx-auto flex max-w-screen-sm items-start gap-2.5 px-4 py-2.5">
        <Info className="mt-0.5 shrink-0 text-[#b7791f]" size={18} weight="fill" aria-hidden="true" />
        <p className="flex-1 text-[12px] leading-5">
          Website đang trong quá trình hoàn thiện và nâng cấp. Hiện Hòa Phúc chưa mở bán và chưa tiếp nhận đơn hàng trực tuyến.
        </p>
        <button type="button" onClick={() => setVisible(false)} className="shrink-0 rounded-full p-1 text-[#8d6b2d] transition-colors hover:bg-[#f5e8c6]" aria-label="Đóng thông báo">
          <X size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
