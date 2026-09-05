"use client";

import type { Product } from "@/data/products";
import { getProductPrice } from "@/data/pricing";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type CheckoutInfo = {
  name: string;
  email: string;
  phone: string;
  province: string;
  ward: string;
  address: string;
  note: string;
};

const STORAGE_KEY = "hoaphuc-cart-v2";
const CHECKOUT_KEY = "hoaphuc-checkout-v1";
const CART_EVENT = "hoaphuc-cart-updated";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function subscribeCart(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CART_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CART_EVENT, listener);
  };
}

export function addProductToCart(product: Product) {
  const items = readCart();
  const price = product.price ?? getProductPrice(product.slug);
  const exists = items.find((item) => item.slug === product.slug);
  const next = exists
    ? items.map((item) => (item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item))
    : [...items, { slug: product.slug, name: product.name, image: product.image, price, quantity: 1 }];
  writeCart(next);
}

export function setItemQuantity(slug: string, quantity: number) {
  const items = readCart();
  const next = items
    .map((item) => (item.slug === slug ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  writeCart(next);
}

export function updateItem(slug: string, delta: number) {
  const items = readCart();
  const next = items
    .map((item) => (item.slug === slug ? { ...item, quantity: item.quantity + delta } : item))
    .filter((item) => item.quantity > 0);
  writeCart(next);
}

export function removeItem(slug: string) {
  writeCart(readCart().filter((item) => item.slug !== slug));
}

export function clearCart() {
  writeCart([]);
}

export function saveCheckoutInfo(info: CheckoutInfo) {
  window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify(info));
}

export function readCheckoutInfo(): CheckoutInfo {
  if (typeof window === "undefined") return { name: "", email: "", phone: "", province: "", ward: "", address: "", note: "" };
  try {
    const raw = window.localStorage.getItem(CHECKOUT_KEY);
    if (!raw) return { name: "", email: "", phone: "", province: "", ward: "", address: "", note: "" };
    const parsed = JSON.parse(raw) as CheckoutInfo;
    return {
      name: parsed.name ?? "",
      email: parsed.email ?? "",
      phone: parsed.phone ?? "",
      province: parsed.province ?? "",
      ward: parsed.ward ?? "",
      address: parsed.address ?? "",
      note: parsed.note ?? "",
    };
  } catch {
    return { name: "", email: "", phone: "", province: "", ward: "", address: "", note: "" };
  }
}
