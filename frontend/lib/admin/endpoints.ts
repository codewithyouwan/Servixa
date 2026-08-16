/** Admin API paths — must match backend/app/admin/routers/. */

export const ADMIN_ENDPOINTS = {
  login: "/admin/auth/login",
  me: "/admin/auth/me",
  users: "/admin/users",
  user: (id: string) => `/admin/users/${id}`,
  admins: "/admin/admins",
  admin: (id: string) => `/admin/admins/${id}`,
} as const;
