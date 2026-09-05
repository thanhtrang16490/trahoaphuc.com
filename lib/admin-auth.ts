import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const ADMIN_ROLES = ["admin", "staff", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export async function getAdminContext() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("is_active").eq("id", authData.user.id).maybeSingle();
  if (profile && !profile.is_active) return null;
  const { data: roleData } = await admin.from("user_roles").select("role").eq("user_id", authData.user.id).maybeSingle();
  const role = roleData?.role as AdminRole | undefined;
  if (!role || !ADMIN_ROLES.includes(role)) return null;
  return { user: authData.user, role, admin };
}
