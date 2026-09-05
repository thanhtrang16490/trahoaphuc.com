"use client";

import { products } from "@/data/products";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { addProductToCart } from "./cart-store";
import { useToast } from "@/components/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/products";
import { trackEvent } from "@/lib/analytics";

export function AddToCartButton({ slug, product: providedProduct, className = "", buyNow = false }: { slug: string; product?: Product; className?: string; buyNow?: boolean }) {
  const product = providedProduct ?? products.find((item) => item.slug === slug);
  const { showToast } = useToast();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  if (!product) return null;

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    addProductToCart(product);
    trackEvent(buyNow ? "begin_checkout" : "add_to_cart", { currency: "VND", value: product.price ?? 0, item_id: product.slug, item_name: product.name });
    if (buyNow) {
      router.push("/gio-hang");
      return;
    }
    window.setTimeout(() => {
      setIsAdding(false);
      showToast({ title: "Đã thêm vào giỏ hàng", message: product.name });
    }, 260);
  };

  return (
    <button title={buyNow ? "Mua ngay" : "Thêm vào giỏ hàng"} aria-label={`${buyNow ? "Mua ngay" : "Thêm"} ${product.name}`} disabled={isAdding} className={`button button-primary w-full justify-center px-3 text-xs md:w-auto md:px-5 md:text-sm ${className}`} onClick={handleAdd}>
      <ShoppingCartSimple size={17} weight="bold" className={isAdding ? "animate-pulse" : ""} />
      <span>{isAdding ? "Đang thêm..." : buyNow ? "Mua ngay" : "Thêm vào giỏ"}</span>
    </button>
  );
}
