import { products } from "@/data/products";
import { getProductPrice } from "@/data/pricing";
import { apiOptions, apiResponse } from "@/lib/api-v1";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trahoaphuc.com";

function serializeProduct(product: (typeof products)[number]) {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    shortDescription: product.shortDescription,
    price: getProductPrice(product.slug),
    packageLabel: product.packageLabel,
    origin: product.origin,
    image: `${siteOrigin}${product.image}`,
    imageWidth: product.imageWidth,
    imageHeight: product.imageHeight,
  };
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = url.searchParams.get("category")?.trim().toLowerCase() ?? "";
  const requestedLimit = Number(url.searchParams.get("limit") ?? "");
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(Math.floor(requestedLimit), 50) : 50;

  const filtered = products.filter((product) => {
    const matchesQuery = !query || [product.name, product.category, product.shortDescription].join(" ").toLowerCase().includes(query);
    const matchesCategory = !category || product.category.toLowerCase() === category;
    return matchesQuery && matchesCategory;
  });

  return apiResponse({ items: filtered.slice(0, limit).map(serializeProduct), total: filtered.length });
}

export function OPTIONS() {
  return apiOptions();
}
