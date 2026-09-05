import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiOptions, apiResponse } from "@/lib/api-v1";

type CartInput = { slug: string; quantity: number };

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { items?: unknown } | null;
  if (!body || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return apiError("Giỏ hàng không hợp lệ.", 422);
  }

  const items = body.items.filter((item): item is CartInput => {
    if (!item || typeof item !== "object") return false;
    const value = item as Record<string, unknown>;
    return typeof value.slug === "string" && value.slug.trim().length > 0 && Number.isInteger(value.quantity) && Number(value.quantity) > 0 && Number(value.quantity) <= 99;
  });
  if (items.length !== body.items.length) return apiError("Thông tin sản phẩm trong giỏ chưa hợp lệ.", 422);

  try {
    const admin = createAdminClient();
    const slugs = items.map((item) => item.slug.trim());
    const [{ data: products, error: productsError }, { data: prices, error: pricesError }] = await Promise.all([
      admin.from("products").select("slug, name, image, stock_quantity").in("slug", slugs).eq("is_active", true),
      admin.from("product_prices").select("product_id, price_vnd, original_price_vnd, products!inner(slug)").in("products.slug", slugs),
    ]);
    if (productsError || pricesError) return apiError("Chưa thể kiểm tra giỏ hàng lúc này.", 503);

    const priceBySlug = new Map((prices ?? []).map((row) => {
      const product = Array.isArray(row.products) ? row.products[0] : row.products;
      return [product?.slug, { price: Number(row.price_vnd), originalPrice: Number(row.original_price_vnd || row.price_vnd) }];
    }));
    const productBySlug = new Map((products ?? []).map((product) => [product.slug, product]));
    const normalized = items.map((item) => {
      const product = productBySlug.get(item.slug);
      const price = priceBySlug.get(item.slug);
      return {
        slug: item.slug,
        name: product?.name ?? "",
        image: product?.image ?? "",
        quantity: item.quantity,
        price: price?.price ?? 0,
        originalPrice: price?.originalPrice ?? price?.price ?? 0,
        stock: Number(product?.stock_quantity ?? 0),
        available: Boolean(product && price && Number(product.stock_quantity ?? 0) >= item.quantity),
      };
    });

    return apiResponse({
      items: normalized,
      valid: normalized.every((item) => item.available),
    });
  } catch {
    return apiError("Chưa thể kiểm tra giỏ hàng lúc này.", 503);
  }
}
