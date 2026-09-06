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

/** What POST /auth/login returns — Cognito's token set. */
interface TokenPair {
  accessToken: string;
  idToken: string;
  refreshToken?: string | null;
  /** Seconds until the access token expires. */
  expiresIn: number;
}

export const AdminAuthService = {
  /**
   * Two steps, because Cognito authenticates but does not authorize: the
   * shared login proves who you are, and /admin/auth/me is what says the
   * account is an active admin. The token is stored between them so the
   * probe can carry it; a non-admin gets 403 there and the token is dropped
   * again, so nothing is left behind for a rejected sign-in.
   */
  async login(email: string, password: string): Promise<AdminSession> {
    const { data: tokens } = await adminApiClient.request<TokenPair>(
      ADMIN_ENDPOINTS.login,
      { method: "POST", body: { email, password } },
    );

    const expiresAt = Date.now() + tokens.expiresIn * 1000;
    adminSession.set({ accessToken: tokens.accessToken, expiresAt, admin: null });

    try {
      const admin = await this.me();
      const session: AdminSession = { accessToken: tokens.accessToken, expiresAt, admin };
      adminSession.set(session);
      return session;
    } catch (err) {
      adminSession.clear();
      throw err;
    }
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
