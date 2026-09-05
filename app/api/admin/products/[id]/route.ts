import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền cập nhật sản phẩm.", 403);
  const body = await request.json().catch(() => ({}));
  const stock = Number(body.stock_quantity);
  const lowStockThreshold = body.low_stock_threshold === undefined || body.low_stock_threshold === "" ? 10 : Number(body.low_stock_threshold);
  if (!Number.isInteger(stock) || stock < 0 || !Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) return apiError("Tồn kho hoặc ngưỡng cảnh báo không hợp lệ.", 422);
  const { id } = await params;
  const { data: previousProduct } = await context.admin.from("products").select("stock_quantity").eq("id", id).maybeSingle();
  const fields = {
    name: typeof body.name === "string" ? body.name.trim() : undefined,
    slug: typeof body.slug === "string" ? body.slug.trim().toLowerCase() : undefined,
    category_id: typeof body.category_id === "string" ? body.category_id : undefined,
    short_description: typeof body.short_description === "string" ? body.short_description.trim() : undefined,
    long_description: typeof body.long_description === "string" ? body.long_description.trim() : undefined,
    package_label: typeof body.package_label === "string" ? body.package_label.trim() : undefined,
    image: typeof body.image === "string" ? body.image.trim() : undefined,
    box_image: typeof body.box_image === "string" ? body.box_image.trim() : undefined,
    origin: typeof body.origin === "string" ? body.origin.trim() : undefined,
    stock_quantity: stock,
    low_stock_threshold: lowStockThreshold,
    is_active: body.is_active !== false,
  };
  const { data, error } = await context.admin.from("products").update(fields).eq("id", id).select("id, name, stock_quantity, is_active").single();
  if (error) return apiError("Không thể cập nhật sản phẩm.", 503);
  if (body.price_vnd !== undefined) {
    const price = Number(body.price_vnd);
    const originalPrice = body.original_price_vnd === undefined || body.original_price_vnd === "" ? price : Number(body.original_price_vnd);
    if (!Number.isInteger(price) || price <= 0 || !Number.isInteger(originalPrice) || originalPrice < price) return apiError("Giá gốc phải lớn hơn hoặc bằng giá bán.", 422);
    const { error: priceError } = await context.admin.from("product_prices").update({ price_vnd: price, original_price_vnd: originalPrice }).eq("product_id", id);
  if (priceError) return apiError("Sản phẩm đã cập nhật nhưng giá chưa đồng bộ.", 503);
  }
  if (previousProduct && previousProduct.stock_quantity !== stock) {
    const movementType = body.movement_type === "inbound" ? "inbound" : body.movement_type === "outbound" ? "outbound" : "adjustment";
    const { data: warehouse } = await context.admin.from("warehouses").select("id").eq("code", "MAIN").maybeSingle();
    if (warehouse) {
      await context.admin.from("inventory_levels").upsert({ warehouse_id: warehouse.id, product_id: id, quantity: stock }, { onConflict: "warehouse_id,product_id" });
      await context.admin.from("inventory_movements").insert({ warehouse_id: warehouse.id, product_id: id, movement_type: movementType, quantity: stock - previousProduct.stock_quantity, note: typeof body.movement_note === "string" ? body.movement_note.trim().slice(0, 300) : "Điều chỉnh tồn kho từ admin", actor_id: context.user.id });
    }
  }
  return apiResponse(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context || !["admin", "editor"].includes(context.role)) return apiError("Bạn không có quyền xóa sản phẩm.", 403);
  const { id } = await params;
  const { data, error } = await context.admin.from("products").update({ is_active: false }).eq("id", id).select("id, name, is_active").single();
  if (error) return apiError("Không thể ẩn sản phẩm.", 503);
  return apiResponse(data);
}
