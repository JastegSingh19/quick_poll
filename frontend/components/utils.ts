export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function getUserKey(): string {
  const key = typeof window !== "undefined" ? localStorage.getItem("qp_user_key") : null;
  if (key) return key;
  const nk = `u_${Math.random().toString(36).slice(2)}${Date.now()}`;
  if (typeof window !== "undefined") localStorage.setItem("qp_user_key", nk);
  return nk;
}
