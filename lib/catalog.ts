import "server-only";

import { categories as localCategories, type Category } from "@/data/categories";
import { products as localProducts, type Product } from "@/data/products";
import { getProductPrice } from "@/data/pricing";
import { createClient } from "@/lib/supabase/server";

type SupabaseCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

type SupabaseProductRow = {
  id: string;
  slug: string;
  category_id: string;
  name: string;
  short_description: string;
  long_description: string;
  ingredients: unknown;
  benefits: unknown;
  package_label: string;
  image: string;
  image_width: number;
  image_height: number;
  box_image: string;
  box_image_width: number;
  box_image_height: number;
  origin: string;
};

type SupabasePriceRow = {
  product_id: string;
  price_vnd: number | string;
};

export type Catalog = {
  categories: Category[];
  products: Product[];
};

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function localCatalog(): Catalog {
  return {
    categories: localCategories,
    products: localProducts.map((product) => ({
      ...product,
      price: getProductPrice(product.slug),
    })),
  };
}

async function fetchCatalogFromSupabase(): Promise<Catalog> {
  const supabase = await createClient();
  const [categoriesResult, productsResult, pricesResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name, description")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select(
        "id, slug, category_id, name, short_description, long_description, ingredients, benefits, package_label, image, image_width, image_height, box_image, box_image_width, box_image_height, origin",
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase.from("product_prices").select("product_id, price_vnd"),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (productsResult.error) throw productsResult.error;
  if (pricesResult.error) throw pricesResult.error;

  const categoryRows = (categoriesResult.data ?? []) as SupabaseCategoryRow[];
  const productRows = (productsResult.data ?? []) as SupabaseProductRow[];
  const priceRows = (pricesResult.data ?? []) as SupabasePriceRow[];
  const categoryById = new Map(categoryRows.map((category) => [category.id, category]));
  const priceByProductId = new Map(priceRows.map((price) => [price.product_id, Number(price.price_vnd)]));

  return {
    categories: categoryRows.map(({ slug, name, description }) => ({ slug, name, description })),
    products: productRows
      .filter((product) => categoryById.has(product.category_id))
      .map((product) => ({
        slug: product.slug,
        name: product.name,
        category: categoryById.get(product.category_id)?.name ?? "",
        price: priceByProductId.get(product.id) ?? getProductPrice(product.slug),
        shortDescription: product.short_description,
        longDescription: product.long_description,
        ingredients: toStringArray(product.ingredients),
        benefits: toStringArray(product.benefits),
        packageLabel: product.package_label,
        image: product.image,
        imageWidth: product.image_width,
        imageHeight: product.image_height,
        boxImage: product.box_image,
        boxImageWidth: product.box_image_width,
        boxImageHeight: product.box_image_height,
        origin: product.origin,
      })),
  };
}

export async function getCatalog(): Promise<Catalog> {
  try {
    return await fetchCatalogFromSupabase();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[catalog] Supabase catalog unavailable; using local fallback.",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
    return localCatalog();
  }
}

export async function getProducts() {
  return (await getCatalog()).products;
}

export async function getCategories() {
  return (await getCatalog()).categories;
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getRelatedProducts(slug: string) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);
  return products.filter((item) => item.slug !== slug && item.category === product?.category).slice(0, 3);
}
