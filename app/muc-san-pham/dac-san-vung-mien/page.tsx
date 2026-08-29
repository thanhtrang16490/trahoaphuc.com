import type { Metadata } from "next";
import { generateCategoryMetadata, CategoryDetailPage } from "../category-detail";

export const metadata: Metadata = generateCategoryMetadata("dac-san-vung-mien");

export default function Page() {
  return <CategoryDetailPage slug="dac-san-vung-mien" />;
}
