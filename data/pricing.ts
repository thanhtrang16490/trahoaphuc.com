import type { Product } from "./products";

const priceMap: Record<string, number> = {
  "tra-thanh-nhiet-hoa-phuc": 130000,
  "tra-duong-tam-an-nhien": 140000,
  "tra-gao-lut-la-sen": 130000,
  "tra-bat-bao-cuc-phuong": 140000,
  "tra-thanh-nhiet-mat-gan": 130000,
  "tra-gao-lut-la-sen-tui": 130000,
  "tra-duong-tam-an-nhien-tui": 140000,
  "thao-duoc-ngam-chan": 129000,
  "mat-ong-hoa-phuc": 180000,
};

export function getProductPrice(slug: string) {
  return priceMap[slug] ?? 169000;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}

export function buildCartItem(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: getProductPrice(product.slug),
    quantity: 1,
  };
}
