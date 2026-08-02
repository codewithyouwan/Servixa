/** User domain types — mirror backend/app/schemas/user.py and backend/db/schema.sql (users table). */

export type UserRole = "homeowner" | "service_provider" | "brand" | "admin";

export interface UserAddress {
  line1?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  address: UserAddress;
  createdAt: string; // ISO 8601
}

/** Payload decoded from the JWT access token. */
export interface AuthSession {
  user: User;
  accessToken: string;
  /** Epoch ms when the access token expires. */
  expiresAt: number;
}
