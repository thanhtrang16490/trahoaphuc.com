import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

try {
  process.loadEnvFile?.(".env.local");
} catch {
  // Environment variables may already be provided by the shell or CI.
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Quản trị viên";
const username = process.env.ADMIN_USERNAME?.trim() || email?.split("@")[0] || "admin";

if (!url || !secretKey || !email || !password) {
  console.error("Thiếu NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL hoặc ADMIN_PASSWORD.");
  process.exit(1);
}

const admin = createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false } });
let user;
const created = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name, username } });

if (created.error && !created.error.message.toLowerCase().includes("already registered")) {
  console.error("Không thể tạo tài khoản admin.");
  process.exit(1);
}

if (created.data.user) {
  user = created.data.user;
} else {
  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  user = listed.data.users.find((item) => item.email?.toLowerCase() === email);
}

if (!user) {
  console.error("Không tìm thấy tài khoản admin sau khi tạo.");
  process.exit(1);
}

const updated = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true, user_metadata: { name, username } });
if (updated.error) {
  console.error("Không thể cập nhật credential tài khoản admin.");
  process.exit(1);
}

const { error: profileError } = await admin.from("profiles").upsert({ id: user.id, email, full_name: name, is_active: true });
const { error: roleError } = await admin.from("user_roles").upsert({ user_id: user.id, role: "admin" });
if (profileError || roleError) {
  console.error("Tài khoản đã tồn tại nhưng chưa gán được hồ sơ hoặc role admin.");
  process.exit(1);
}

console.log(`Admin ready: ${email}`);
