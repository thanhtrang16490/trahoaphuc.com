"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const uniqueImages = images.filter((image, index, all) => all.findIndex((item) => item.src === image.src) === index);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = uniqueImages[selectedIndex] ?? uniqueImages[0];

  if (!selectedImage) return null;

  return (
    <div className="flex gap-4">
      {uniqueImages.length > 1 ? (
        <div className="flex max-h-[520px] w-20 shrink-0 flex-col gap-3 overflow-y-auto pr-1" aria-label="Ảnh sản phẩm">
          {uniqueImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Xem ${image.label}`}
              aria-pressed={selectedIndex === index}
              className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 transition-all duration-200 ${
                selectedIndex === index
                  ? "border-[var(--green)] ring-2 ring-[rgba(15,77,50,0.18)]"
                  : "border-gray-200 hover:border-[var(--green)]"
              }`}
            >
              <Image src={image.src} alt="" width={image.width} height={image.height} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 aspect-square items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_12px_28px_rgba(20,44,33,0.06)] lg:p-8">
        <Image
          src={selectedImage.src}
          alt={`${productName} - ${selectedImage.label}`}
          width={selectedImage.width}
          height={selectedImage.height}
          className="h-full w-full object-contain transition-opacity duration-200"
          priority
        />
      </div>
    </div>
  );
}
