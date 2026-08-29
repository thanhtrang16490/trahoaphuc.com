import type { Product } from "./products";

const priceMap: Record<string, number> = {
  "tra-duong-tam-an-nhien": 168000,
  "tra-thanh-nhiet-hoa-phuc": 178000,
  "tra-gao-lut-la-sen": 185000,
  "tra-bat-bao-cuc-phuong": 195000,
  "tra-thanh-nhiet-mat-gan": 172000,
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
