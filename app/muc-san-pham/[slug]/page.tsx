import type { Metadata } from "next";
import { generateCategoryMetadata, generateCategoryStaticParams, CategoryDetailPage } from "../category-detail";

export async function generateStaticParams() {
  return generateCategoryStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generateCategoryMetadata(slug);
}

export default async function CategoryRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryDetailPage slug={slug} />;
}
