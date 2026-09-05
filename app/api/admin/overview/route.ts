import { apiError, apiResponse } from "@/lib/api-v1";
import { getAdminContext } from "@/lib/admin-auth";

export async function GET() {
  try {
    const context = await getAdminContext();
    if (!context) return apiError("Bạn không có quyền truy cập khu vực quản trị.", 403);

    const { admin } = context;
    const [products, categories, orders, users, roles, leads, coupons, news] = await Promise.all([
      admin.from("products").select("id, slug, name, short_description, long_description, package_label, image, box_image, origin, is_active, stock_quantity, category_id, product_prices(price_vnd)").order("sort_order"),
      admin.from("categories").select("id, name").order("sort_order"),
      admin.from("orders").select("id, order_number, customer_name, customer_email, customer_phone, recipient_name, recipient_email, recipient_phone, shipping_address, shipping_note, total_vnd, subtotal_vnd, shipping_fee_vnd, discount_vnd, status, payment_status, payment_method, coupon_code, created_at, order_items(id, product_name, product_slug, unit_price_vnd, quantity, line_total_vnd)").order("created_at", { ascending: false }).limit(100),
      admin.from("profiles").select("id, email, full_name, phone, province, account_type, is_active, created_at").order("created_at", { ascending: false }).limit(100),
      admin.from("user_roles").select("user_id, role"),
      admin.from("leads").select("id, name, phone, area, business_type, status, created_at").order("created_at", { ascending: false }).limit(100),
      admin.from("coupons").select("id, code, label, is_active, usage_count, usage_limit").order("created_at", { ascending: false }),
      admin.from("news_posts").select("id, slug, title, category, status, published_at, updated_at").order("updated_at", { ascending: false }),
    ]);

    const firstError = [products, categories, orders, users, roles, leads, coupons, news].find((item) => item.error)?.error;
    if (firstError) return apiError("Chưa thể tải dữ liệu quản trị.", 503);

    return apiResponse({ role: context.role, user_id: context.user.id, products: products.data ?? [], categories: categories.data ?? [], orders: orders.data ?? [], users: users.data ?? [], roles: roles.data ?? [], leads: leads.data ?? [], coupons: coupons.data ?? [], news: news.data ?? [] });
  } catch {
    return apiError("Khu vực quản trị chưa sẵn sàng.", 503);
  }
}
