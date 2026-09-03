"use client";

import { Lightning, ShoppingCartSimple } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { addProductToCart } from "@/components/cart-store";
import { useToast } from "@/components/toast";

export function ProductCardActions({ product }: { product: Product }) {
  const router = useRouter();
  const { showToast } = useToast();

  const addToCart = () => {
    addProductToCart(product);
    showToast({ title: "Đã thêm vào giỏ hàng", message: product.name });
  };

  const buyNow = () => {
    addToCart();
    router.push("/gio-hang");
  };

  return (
    <div className="relative z-20 flex shrink-0 items-center gap-2">
      <button type="button" onClick={addToCart} title="Thêm vào giỏ hàng" aria-label={`Thêm ${product.name} vào giỏ hàng`} className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(15,77,50,0.14)] bg-white text-[var(--green)] shadow-[0_8px_16px_rgba(15,77,50,0.08)] transition-transform hover:-translate-y-0.5 active:scale-95">
        <ShoppingCartSimple size={18} weight="bold" />
      </button>
      <button type="button" onClick={buyNow} title="Mua nhanh" aria-label={`Mua nhanh ${product.name}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--green)] text-white shadow-[0_8px_16px_rgba(15,77,50,0.16)] transition-transform hover:-translate-y-0.5 active:scale-95">
        <Lightning size={18} weight="fill" />
      </button>
    </div>
  );
}
