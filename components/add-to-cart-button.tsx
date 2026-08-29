"use client";

import { products } from "@/data/products";
import { addProductToCart } from "./cart-store";

export function AddToCartButton({ slug }: { slug: string }) {
  const product = products.find((item) => item.slug === slug);
  if (!product) return null;

  return (
    <button className="button button-primary w-full justify-center md:w-auto" onClick={() => addProductToCart(product)}>
      Thêm vào giỏ
    </button>
  );
}
