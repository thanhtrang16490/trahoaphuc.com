"use client";

import { Phone } from "@phosphor-icons/react";
import { brand } from "@/data/site";

const phoneHref = `tel:${brand.phone.replace(/\s+/g, "")}`;

/** Desktop floating contact actions adapted from EPCVINA's CallBox/ZaloBox pattern. */
export function FloatingContactActions() {
  return (
    <div className="floating-contact-actions hidden md:block" aria-label="Liên hệ nhanh với Hòa Phúc">
      <div className="call-container right">
        <a id="call-btn" href={phoneHref} rel="noopener nofollow" aria-label={`Gọi Hòa Phúc ${brand.phone}`}>
          <div className="animated_call infinite zoomIn_call cmoz-alo-circle" />
          <div className="animated_call infinite pulse_call cmoz-alo-circle-fill" />
          <span className="contact-action-icon">
            <Phone weight="fill" className="size-4 text-white" aria-hidden="true" />
          </span>
        </a>
      </div>

      <div className="zalo-container right">
        <a id="zalo-btn" href={brand.zalo} target="_blank" rel="noopener nofollow" aria-label="Chat Zalo với Hòa Phúc">
          <div className="animated_zalo infinite zoomIn_zalo cmoz-alo-circle" />
          <div className="animated_zalo infinite pulse_zalo cmoz-alo-circle-fill" />
          <span className="contact-action-icon">
            <img src="/icons8-zalo.svg" alt="Zalo" width={40} height={40} className="zalo-icon" />
          </span>
        </a>
      </div>
    </div>
  );
}
