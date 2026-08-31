import type { ApiKey, AuditLog, BlockedNumber, Gateway, Job, Project, Stats } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function adminToken(): string {
  return localStorage.getItem("admin_token") ?? "";
}

export function setAdminToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function hasAdminToken(): boolean {
  return adminToken().length > 0;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken()}`,
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 401) {
    throw new Error("Unauthorized — check your admin secret.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: { message?: string } })?.error?.message ?? `HTTP ${res.status}`);
  }
  return body as T;
}

export const api = {
  stats: () => request<Stats>("/api/admin/stats"),
  projects: () => request<{ projects: Project[] }>("/api/admin/projects"),
  createProject: (p: { name: string }) =>
    request<{ project: Project }>("/api/admin/projects", { method: "POST", body: JSON.stringify(p) }),
  setProjectStatus: (id: string, status: string) =>
    request<{ project: Project }>(`/api/admin/projects/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
  updateProjectLimits: (id: string, limits: Partial<Project>) =>
    request<{ project: Project }>(`/api/admin/projects/${id}/limits`, { method: "PATCH", body: JSON.stringify(limits) }),
  keys: (projectId: string) => request<{ keys: ApiKey[] }>(`/api/admin/projects/${projectId}/keys`),
  createKey: (projectId: string, name: string) =>
    request<{ api_key: string; masked: string }>(`/api/admin/projects/${projectId}/keys`, { method: "POST", body: JSON.stringify({ name }) }),
  revokeKey: (id: string) => request<{ ok: boolean }>(`/api/admin/keys/${id}/revoke`, { method: "POST" }),
  gateways: () => request<{ gateways: Gateway[] }>("/api/admin/gateways"),
  setGatewayStatus: (id: string, status: string) =>
    request<{ gateway: Gateway }>(`/api/admin/gateways/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
  jobs: () => request<{ jobs: Job[] }>("/api/admin/jobs"),
  blocklist: () => request<{ numbers: BlockedNumber[] }>("/api/admin/blocklist"),
  addBlocked: (phone: string, reason: string) =>
    request<{ ok: boolean }>("/api/admin/blocklist", { method: "POST", body: JSON.stringify({ phone, reason }) }),
  removeBlocked: (phone: string) =>
    request<{ ok: boolean }>(`/api/admin/blocklist/${encodeURIComponent(phone)}`, { method: "DELETE" }),
  logs: () => request<{ logs: AuditLog[] }>("/api/admin/logs"),
  maintenance: () => request<Record<string, unknown>>("/api/admin/maintenance", { method: "POST" }),
};
