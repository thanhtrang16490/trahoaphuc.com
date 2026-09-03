"use client";

import { usePathname } from "next/navigation";

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mobile-app-shell">
      <div key={pathname} className="mobile-route-view">
        {children}
      </div>
    </div>
  );
}
