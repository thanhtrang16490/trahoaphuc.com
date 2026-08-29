import type { Metadata } from "next";
import { generateCategoryMetadata, generateCategoryStaticParams, CategoryDetailPage } from "../category-detail";

export function generateStaticParams() {
  return generateCategoryStaticParams();
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return generateCategoryMetadata(params.slug);
}

export default function CategoryRoutePage({ params }: { params: { slug: string } }) {
  return <CategoryDetailPage slug={params.slug} />;
}
