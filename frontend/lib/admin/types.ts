/**
 * Admin module domain types — mirror backend/app/admin/schemas/.
 *
 * These use the DATABASE vocabulary for accounts (`UserType`: homeowner |
 * contractor | company), not the display roles in lib/types/user.ts
 * (homeowner | service_provider | brand). The back office writes rows, so it
 * speaks the schema's language.
 */

export type AdminRole = "super_admin" | "support_admin" | "moderator";
export type UserType = "homeowner" | "contractor" | "company";
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
  accessToken: string;
  /** Epoch ms. */
  expiresAt: number;
  admin: Admin;
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
  /** False for accounts provisioned without a password (social login only). */
  hasPassword: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;

  // Contractor-only
  businessName?: string | null;
  contractorType?: ContractorType | null;
  isVerified?: boolean | null;
  avgRatings?: number | null;

  // Company-only
  companyName?: string | null;
  companyDetails?: Record<string, unknown> | null;
}

export interface ManagedUserCreate {
  name: string;
  email: string;
  type: UserType;
  address: UserAddress;
  country: string;
  password?: string;
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
  password: string;
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
