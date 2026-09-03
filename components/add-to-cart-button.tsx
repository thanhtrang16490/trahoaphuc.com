"use client";

import { products } from "@/data/products";
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
    <button className={`button button-primary w-full justify-center md:w-auto ${className}`} onClick={handleAdd}>
      Thêm vào giỏ
    </button>
  );
}
