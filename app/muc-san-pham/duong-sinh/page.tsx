import type { Metadata } from "next";
import { generateCategoryMetadata, CategoryDetailPage } from "../category-detail";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("duong-sinh");
}

export default async function Page() {
  return <CategoryDetailPage slug="duong-sinh" />;
}
