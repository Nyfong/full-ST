"use client";

const TOKEN_KEY = "blog_token";
const USER_KEY = "blog_user";

export type StoredUser = { id: string; name: string; email: string; avatar: string | null; role: string };

export function saveAuth(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function updateStoredUser(updates: Partial<StoredUser>) {
  const user = getUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, ...updates }));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
