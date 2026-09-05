import { HomePage } from "@/components/home-page";
import { getCatalog } from "@/lib/catalog";

export default async function Page() {
  const { products, categories } = await getCatalog();
  return <HomePage products={products} categories={categories} />;
}
