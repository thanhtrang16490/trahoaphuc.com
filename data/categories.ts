import { products } from "@/data/products";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "tra-thao-moc",
    name: "Trà thảo mộc",
    description: "Nhóm trà thảo mộc thanh lành, dễ uống, phù hợp dùng hằng ngày và làm quà biếu.",
  },
  {
    slug: "duong-sinh",
    name: "Dưỡng sinh",
    description: "Các sản phẩm hướng đến phong cách sống cân bằng, gọn vị và tinh tế.",
  },
  {
    slug: "dac-san-vung-mien",
    name: "Đặc sản vùng miền",
    description: "Công thức gắn với Cúc Phương, Ninh Bình và cảm hứng bản địa Việt Nam.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategoryName(categoryName: string) {
  return products.filter((product) => product.category === categoryName);
}

