import type { Metadata } from "next";
import { generateCategoryMetadata, CategoryDetailPage } from "../category-detail";

export const metadata: Metadata = generateCategoryMetadata("duong-sinh");

export default function Page() {
  return <CategoryDetailPage slug="duong-sinh" />;
}
