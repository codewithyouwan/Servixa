/** Admin API services — the only callers of adminApiClient. */

import { adminApiClient } from "@/lib/admin/client";
import { ADMIN_ENDPOINTS } from "@/lib/admin/endpoints";
import { adminSession } from "@/lib/admin/session";
import type {
  Admin,
  AdminCreate,
  AdminSession,
  AdminUpdate,
  ManagedUser,
  ManagedUserCreate,
  ManagedUserUpdate,
  UserListParams,
} from "@/lib/admin/types";

export const AdminAuthService = {
  async login(email: string, password: string): Promise<AdminSession> {
    const { data } = await adminApiClient.request<AdminSession>(ADMIN_ENDPOINTS.login, {
      method: "POST",
      body: { email, password },
    });
    adminSession.set(data);
    return data;
  },

  /** Validates the stored token server-side; also picks up role changes. */
  async me(signal?: AbortSignal): Promise<Admin> {
    return (await adminApiClient.request<Admin>(ADMIN_ENDPOINTS.me, { signal })).data;
  },

  logout(): void {
    adminSession.clear();
  },
};

export const AdminUserService = {
  async list(params: UserListParams = {}, signal?: AbortSignal): Promise<ManagedUser[]> {
    return (
      await adminApiClient.request<ManagedUser[]>(ADMIN_ENDPOINTS.users, {
        params: {
          type: params.type,
          search: params.search || undefined,
          includeDeleted: params.includeDeleted || undefined,
        },
        signal,
      })
    ).data;
  },

  async create(payload: ManagedUserCreate): Promise<ManagedUser> {
    return (
      await adminApiClient.request<ManagedUser>(ADMIN_ENDPOINTS.users, {
        method: "POST",
        body: payload,
      })
    ).data;
  },

  async update(id: string, payload: ManagedUserUpdate): Promise<ManagedUser> {
    return (
      await adminApiClient.request<ManagedUser>(ADMIN_ENDPOINTS.user(id), {
        method: "PATCH",
        body: payload,
      })
    ).data;
  },
};

export const AdminAccountService = {
  async list(search?: string, signal?: AbortSignal): Promise<Admin[]> {
    return (
      await adminApiClient.request<Admin[]>(ADMIN_ENDPOINTS.admins, {
        params: { search: search || undefined },
        signal,
      })
    ).data;
  },

  async create(payload: AdminCreate): Promise<Admin> {
    return (
      await adminApiClient.request<Admin>(ADMIN_ENDPOINTS.admins, {
        method: "POST",
        body: payload,
      })
    ).data;
  },

  async update(id: string, payload: AdminUpdate): Promise<Admin> {
    return (
      await adminApiClient.request<Admin>(ADMIN_ENDPOINTS.admin(id), {
        method: "PATCH",
        body: payload,
      })
    ).data;
  },
};
