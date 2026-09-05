import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";

const SESSION_ISSUER = "trahoaphuc-zalo-mini-app";
const SESSION_TTL = "30d";

type ZaloProfile = { id: string; name: string; avatar: string };
export type ZaloSessionUser = { id: string; zaloUserId: string; name: string; avatar: string };

function sessionSecret() {
  const value = process.env.ZALO_MINIAPP_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Missing ZALO_MINIAPP_SESSION_SECRET.");
  return new TextEncoder().encode(value);
}

function miniAppId() {
  const value = process.env.ZALO_MINI_APP_ID;
  if (!value) throw new Error("Missing ZALO_MINI_APP_ID.");
  return value;
}

async function getZaloProfile(accessToken: string): Promise<ZaloProfile> {
  const url = new URL("https://graph.zalo.me/v2.0/me");
  url.searchParams.set("fields", "id,name,picture");
  url.searchParams.set("miniapp_id", miniAppId());
  const response = await fetch(url, { headers: { access_token: accessToken }, cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body?.id !== "string" || body.error) throw new Error("Zalo access token is invalid.");
  return {
    id: body.id,
    name: typeof body.name === "string" ? body.name : "Khách hàng Hòa Phúc",
    avatar: typeof body.picture?.data?.url === "string" ? body.picture.data.url : "",
  };
}

function syntheticEmail(zaloUserId: string) {
  const digest = createHash("sha256").update(zaloUserId).digest("hex").slice(0, 40);
  return `zalo-${digest}@users.hoaphuc.local`;
}

async function findOrCreateUser(profile: ZaloProfile) {
  const admin = createAdminClient();
  const existing = await admin.from("zalo_identities").select("user_id").eq("zalo_user_id", profile.id).maybeSingle();
  if (existing.error) throw existing.error;

  let userId = existing.data?.user_id;
  if (!userId) {
    const created = await admin.auth.admin.createUser({
      email: syntheticEmail(profile.id),
      password: randomBytes(32).toString("base64url"),
      email_confirm: true,
      user_metadata: { name: profile.name, avatar: profile.avatar, auth_provider: "zalo" },
    });
    if (created.error || !created.data.user) throw created.error ?? new Error("Could not create Supabase user.");
    userId = created.data.user.id;
  }

  const identity = await admin.from("zalo_identities").upsert({
    zalo_user_id: profile.id,
    user_id: userId,
    display_name: profile.name,
    avatar_url: profile.avatar,
    last_seen_at: new Date().toISOString(),
  }, { onConflict: "zalo_user_id" });
  if (identity.error) throw identity.error;

  await admin.from("profiles").update({ full_name: profile.name }).eq("id", userId);
  return { id: userId, zaloUserId: profile.id, name: profile.name, avatar: profile.avatar } satisfies ZaloSessionUser;
}

export async function signInWithZaloAccessToken(accessToken: string) {
  const profile = await getZaloProfile(accessToken);
  const user = await findOrCreateUser(profile);
  const token = await new SignJWT({ zalo_user_id: user.zaloUserId, name: user.name, avatar: user.avatar })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuer(SESSION_ISSUER)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(sessionSecret());
  return { token, user };
}

export async function getZaloSession(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, sessionSecret(), { issuer: SESSION_ISSUER });
    const subject = verified.payload.sub;
    const zaloUserId = verified.payload.zalo_user_id;
    if (typeof subject !== "string" || typeof zaloUserId !== "string") return null;
    return { id: subject, zaloUserId };
  } catch {
    return null;
  }
}
