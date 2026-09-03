"use client";

import { products } from "@/data/products";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { addProductToCart } from "./cart-store";
import { useToast } from "@/components/toast";

export function AddToCartButton({ slug, className = "" }: { slug: string; className?: string }) {
  const product = products.find((item) => item.slug === slug);
  const { showToast } = useToast();
  if (!product) return null;

  const handleAdd = () => {
    addProductToCart(product);
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: product.name,
    });
  };

  return (
    <button title="Thêm vào giỏ hàng" aria-label={`Thêm ${product.name} vào giỏ hàng`} className={`button button-primary w-full justify-center px-3 text-xs md:w-auto md:px-5 md:text-sm ${className}`} onClick={handleAdd}>
      <ShoppingCartSimple size={17} weight="bold" />
      <span>Thêm vào giỏ</span>
    </button>
  );
}
