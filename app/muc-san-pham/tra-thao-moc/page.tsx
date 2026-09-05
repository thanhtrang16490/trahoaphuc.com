import type { Metadata } from "next";
import { generateCategoryMetadata, CategoryDetailPage } from "../category-detail";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("tra-thao-moc");
}

export default async function Page() {
  return <CategoryDetailPage slug="tra-thao-moc" />;
}
