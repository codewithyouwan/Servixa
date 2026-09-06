/** Admin API paths — must match backend/app/admin/routers/. */

export const ADMIN_ENDPOINTS = {
  /**
   * Shared Cognito login, not an admin-only one: admins sign in through the
   * same user pool as every other role and are told apart by the `admin`
   * group on their token. `me` below is what confirms back-office access.
   */
  login: "/auth/login",
  me: "/admin/auth/me",
  users: "/admin/users",
  user: (id: string) => `/admin/users/${id}`,
  admins: "/admin/admins",
  admin: (id: string) => `/admin/admins/${id}`,
} as const;
