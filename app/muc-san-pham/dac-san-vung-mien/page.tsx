import type { Metadata } from "next";
import { generateCategoryMetadata, CategoryDetailPage } from "../category-detail";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("dac-san-vung-mien");
}

export default async function Page() {
  return <CategoryDetailPage slug="dac-san-vung-mien" />;
}
