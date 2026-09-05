import { getAdminContext } from "@/lib/admin-auth";

const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return new Response("Không có quyền", { status: 403 });
  const { data, error } = await context.admin.from("products").select("slug, name, category_id, short_description, long_description, package_label, origin, image, box_image, stock_quantity, low_stock_threshold, is_active, categories(slug), product_prices(price_vnd, original_price_vnd)").order("sort_order");
  if (error) return new Response("Không thể xuất catalog", { status: 503 });
  const header = ["slug", "name", "category_slug", "short_description", "long_description", "package_label", "origin", "image", "box_image", "price_vnd", "original_price_vnd", "stock_quantity", "low_stock_threshold", "is_active"];
  const lines = [("\ufeff" + header.map(csvCell).join(","))];
  for (const product of data ?? []) {
    const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
    const price = Array.isArray(product.product_prices) ? product.product_prices[0] : product.product_prices;
    lines.push([product.slug, product.name, category?.slug, product.short_description, product.long_description, product.package_label, product.origin, product.image, product.box_image, price?.price_vnd, price?.original_price_vnd, product.stock_quantity, product.low_stock_threshold, product.is_active].map(csvCell).join(","));
  }
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="hoa-phuc-catalog.csv"`, "Cache-Control": "no-store" } });
}
