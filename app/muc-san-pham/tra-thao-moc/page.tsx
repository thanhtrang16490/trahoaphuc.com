import type { Metadata } from "next";
import { generateCategoryMetadata, CategoryDetailPage } from "../category-detail";

export const metadata: Metadata = generateCategoryMetadata("tra-thao-moc");

export default function Page() {
  return <CategoryDetailPage slug="tra-thao-moc" />;
}
