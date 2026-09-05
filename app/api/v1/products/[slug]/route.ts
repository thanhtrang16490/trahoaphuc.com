import { getProductBySlug } from "@/lib/catalog";
import { getProductPrice } from "@/data/pricing";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trahoaphuc.com";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return apiError("Không tìm thấy sản phẩm.", 404);

  return apiResponse({
    ...product,
    price: product.price ?? getProductPrice(product.slug),
    originalPrice: product.originalPrice ?? product.price ?? getProductPrice(product.slug),
    image: `${siteOrigin}${product.image}`,
    boxImage: `${siteOrigin}${product.boxImage}`,
  });
}

export function OPTIONS() {
  return apiOptions();
}
