/**
 * Admin module domain types — mirror backend/app/admin/schemas/.
 *
 * These use the DATABASE vocabulary for accounts, which is what
 * `CREATE TYPE user_type` in backend/db/schema.sql declares: homeowner |
 * service_provider | brand. The back office writes rows, so it speaks the
 * schema's language; display labels live in lib/admin/constants.ts.
 *
 * No password fields anywhere: Cognito owns credentials for admins and
 * marketplace users alike.
 */

export type AdminRole = "super_admin" | "support_admin" | "moderator";
export type UserType = "homeowner" | "service_provider" | "brand";
export type ContractorType = "individual" | "organization";

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  /** The Cognito access token, verified server-side on every request. */
  accessToken: string;
  /** Epoch ms, derived from Cognito's expiresIn. */
  expiresAt: number;
  /**
   * Null only in the moment between logging in and confirming back-office
   * access — AdminAuthService.login fills it in or clears the session.
   */
  admin: Admin | null;
}

export interface UserAddress {
  line1?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  country: string;
  address: Partial<UserAddress>;
  isDeleted: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;

  // Contractor-only
  businessName?: string | null;
  contractorType?: ContractorType | null;
  isVerified?: boolean | null;
  avgRatings?: number | null;

  // Brand-only (from `company`)
  companyName?: string | null;
  companyDetails?: Record<string, unknown> | null;
}

export interface ManagedUserCreate {
  name: string;
  email: string;
  type: UserType;
  address: UserAddress;
  country: string;
  businessName?: string;
  contractorType?: ContractorType;
  companyName?: string;
  companyDetails?: Record<string, unknown>;
}

export type ManagedUserUpdate = Partial<
  Omit<ManagedUserCreate, "type"> & { isDeleted: boolean; isVerified: boolean }
>;

export interface AdminCreate {
  email: string;
  fullName: string;
  role: AdminRole;
}

export type AdminUpdate = Partial<{
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  password: string;
}>;

export interface UserListParams {
  type?: UserType;
  search?: string;
  includeDeleted?: boolean;
}
