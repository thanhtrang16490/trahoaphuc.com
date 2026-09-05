import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

function parseCsv(input: string) {
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let quoted = false;
  for (let index = 0; index < input.length; index += 1) { const char = input[index]; const next = input[index + 1]; if (char === '"' && quoted && next === '"') { cell += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === "," && !quoted) { row.push(cell); cell = ""; } else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && next === "\n") index += 1; row.push(cell); if (row.some((value) => value.trim())) rows.push(row); row = []; cell = ""; } else cell += char; }
  if (cell || row.length) { row.push(cell); if (row.some((value) => value.trim())) rows.push(row); }
  const [header, ...body] = rows; const keys = (header ?? []).map((key) => key.replace(/^\ufeff/, "").trim());
  return body.map((values) => Object.fromEntries(keys.map((key, index) => [key, (values[index] ?? "").trim()])));
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền import catalog.", 403);
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError("Vui lòng chọn file CSV xuất từ Excel.", 422);
  if (file.size > 2_000_000) return apiError("File import không được vượt quá 2MB.", 422);
  const rows = parseCsv(await file.text());
  if (!rows.length) return apiError("File không có dữ liệu sản phẩm.", 422);
  const { data: categories, error: categoryError } = await context.admin.from("categories").select("id, slug");
  if (categoryError) return apiError("Chưa thể tải danh mục sản phẩm.", 503);
  const categoryMap = new Map((categories ?? []).map((category) => [category.slug, category.id]));
  const { data: warehouse } = await context.admin.from("warehouses").select("id").eq("code", "MAIN").maybeSingle();
  let imported = 0; const errors: string[] = [];
  for (const [index, row] of rows.entries()) {
    const line = index + 2; const slug = row.slug?.toLowerCase(); const categoryId = categoryMap.get(row.category_slug ?? ""); const price = Number(row.price_vnd); const originalPrice = Number(row.original_price_vnd || row.price_vnd); const stock = Number(row.stock_quantity || 0); const threshold = Number(row.low_stock_threshold || 10);
    if (!slug || !row.name || !categoryId || !Number.isInteger(price) || price <= 0 || !Number.isInteger(originalPrice) || originalPrice < price || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(threshold) || threshold < 0) { errors.push(`Dòng ${line}: thiếu slug/tên/danh mục hoặc giá, tồn kho không hợp lệ.`); continue; }
    const { data: product, error } = await context.admin.from("products").upsert({ slug, name: row.name, category_id: categoryId, short_description: row.short_description ?? "", long_description: row.long_description ?? "", package_label: row.package_label ?? "", origin: row.origin ?? "", image: row.image ?? "", box_image: row.box_image ?? "", stock_quantity: stock, low_stock_threshold: threshold, is_active: row.is_active !== "false" }, { onConflict: "slug" }).select("id").single();
    if (error || !product) { errors.push(`Dòng ${line}: không thể lưu sản phẩm.`); continue; }
    const { error: priceError } = await context.admin.from("product_prices").upsert({ product_id: product.id, price_vnd: price, original_price_vnd: originalPrice, currency: "VND" }, { onConflict: "product_id" });
    if (priceError) { errors.push(`Dòng ${line}: sản phẩm đã lưu nhưng giá chưa cập nhật.`); continue; }
    if (warehouse) await context.admin.from("inventory_levels").upsert({ warehouse_id: warehouse.id, product_id: product.id, quantity: stock }, { onConflict: "warehouse_id,product_id" });
    imported += 1;
  }
  return apiResponse({ imported, failed: errors.length, errors: errors.slice(0, 20) });
}
