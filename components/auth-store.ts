"use client";

import { createClient } from "@/lib/supabase/client";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: "customer" | "admin";
  username?: string;
};

const AUTH_KEY = "hoaphuc-auth-v1";
const AUTH_EVENT = "hoaphuc-auth-updated";
const MOCK_ADMIN_USERNAME = "admin";
const MOCK_ADMIN_PASSWORD = "admin";

export type AuthCredentials = {
  identifier: string;
  password: string;
};

export function readAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email) return null;
    return {
      id: parsed.id ?? "",
      name: parsed.name ?? "",
      email: parsed.email ?? "",
      phone: parsed.phone ?? "",
      role: parsed.role === "admin" ? "admin" : "customer",
      username: parsed.username ?? "",
    };
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function authenticateMockUser({ identifier, password }: AuthCredentials): AuthUser | null {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!normalizedIdentifier || !normalizedPassword) return null;

  if (normalizedIdentifier === MOCK_ADMIN_USERNAME && normalizedPassword === MOCK_ADMIN_PASSWORD) {
    return {
      name: "Quản trị viên",
      email: "admin@hoaphuc.local",
      phone: "",
      role: "admin",
      username: MOCK_ADMIN_USERNAME,
    };
  }

  return {
    name: identifier.trim(),
    email: identifier.trim(),
    phone: "",
    role: "customer",
    username: identifier.trim(),
  };
}

export function isMockAdminUser(user: AuthUser | null) {
  return user?.role === "admin";
}

export function clearAuthUser() {
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
  void createClient().auth.signOut();
}

export function subscribeAuth(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(AUTH_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(AUTH_EVENT, listener);
  };
}
