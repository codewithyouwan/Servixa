"use client";

/**
 * Create/edit a marketplace user. One dialog for both: passing `user` puts it
 * in edit mode. The two forms differ only in which fields are writable, so
 * splitting them would duplicate the whole body.
 */

import { useState, type FormEvent } from "react";

import {
  CONTRACTOR_TYPE_LABELS,
  PASSWORD_MIN_LENGTH,
  SUPPORTED_COUNTRIES,
  USER_TYPE_LABELS,
} from "@/lib/admin/constants";
import { AdminUserService } from "@/lib/admin/service";
import type { ContractorType, ManagedUser, UserType } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FormError, errorMessage } from "@/app/components/admin/form-parts";

interface UserFormState {
  name: string;
  email: string;
  type: UserType;
  password: string;
  country: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  businessName: string;
  contractorType: ContractorType;
  companyName: string;
  isVerified: boolean;
}

const EMPTY: UserFormState = {
  name: "",
  email: "",
  type: "homeowner",
  password: "",
  country: "US",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  businessName: "",
  contractorType: "individual",
  companyName: "",
  isVerified: false,
};

function fromUser(user: ManagedUser): UserFormState {
  return {
    ...EMPTY,
    name: user.name,
    email: user.email,
    type: user.type,
    country: user.country,
    line1: user.address.line1 ?? "",
    city: user.address.city ?? "",
    state: user.address.state ?? "",
    postalCode: user.address.postalCode ?? "",
    businessName: user.businessName ?? "",
    contractorType: user.contractorType ?? "individual",
    companyName: user.companyName ?? "",
    isVerified: user.isVerified ?? false,
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create; provide to edit. */
  user?: ManagedUser | null;
  onSaved: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSaved }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {/* Mounted only while open and keyed by target, so the form seeds its
            state once on mount — no effect syncing props into state, and a
            previous edit can never leak into the next one. */}
        {open && (
          <UserForm
            key={user?.id ?? "new"}
            user={user ?? null}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function UserForm({
  user,
  onOpenChange,
  onSaved,
}: {
  user: ManagedUser | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState<UserFormState>(() => (user ? fromUser(user) : EMPTY));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof UserFormState>(key: K, value: UserFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const address = {
      line1: form.line1 || undefined,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
    };

    try {
      if (user) {
        await AdminUserService.update(user.id, {
          name: form.name,
          email: form.email,
          country: form.country,
          address,
          // Blank means "leave the current password alone".
          ...(form.password ? { password: form.password } : {}),
          ...(user.type === "contractor"
            ? {
                businessName: form.businessName,
                contractorType: form.contractorType,
                isVerified: form.isVerified,
              }
            : {}),
          ...(user.type === "company" ? { companyName: form.companyName } : {}),
        });
      } else {
        await AdminUserService.create({
          name: form.name,
          email: form.email,
          type: form.type,
          country: form.country,
          address,
          ...(form.password ? { password: form.password } : {}),
          ...(form.type === "contractor"
            ? { businessName: form.businessName, contractorType: form.contractorType }
            : {}),
          ...(form.type === "company" ? { companyName: form.companyName } : {}),
        });
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  // In edit mode the type is fixed: switching it would mean migrating the
  // child row (service_providers / company), so it's create-time only.
  const activeType = user?.type ?? form.type;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update this account. Account type cannot be changed."
            : "Add a homeowner, contractor, or company to the marketplace."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormError error={error} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="user-name" required>
            <Input
              id="user-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              maxLength={100}
            />
          </Field>

          <Field label="Email" htmlFor="user-email" required>
            <Input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </Field>

          <Field label="Account type" htmlFor="user-type" required>
            <Select
              value={activeType}
              onValueChange={(value) => set("type", value as UserType)}
              items={USER_TYPE_LABELS}
              disabled={isEdit}
            >
              <SelectTrigger id="user-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(USER_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Country" htmlFor="user-country" required>
            <Select
              value={form.country}
              onValueChange={(value) => set("country", value as string)}
              items={Object.fromEntries(SUPPORTED_COUNTRIES.map((c) => [c.code, c.name]))}
            >
              <SelectTrigger id="user-country" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field
          label={isEdit ? "New password" : "Password"}
          htmlFor="user-password"
          hint={
            isEdit
              ? "Leave blank to keep the current password."
              : `Optional. At least ${PASSWORD_MIN_LENGTH} characters. Leave blank for a social-login-only account.`
          }
        >
          <Input
            id="user-password"
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            minLength={form.password ? PASSWORD_MIN_LENGTH : undefined}
            autoComplete="new-password"
          />
        </Field>

        {activeType === "contractor" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name" htmlFor="business-name" required>
              <Input
                id="business-name"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                required
                maxLength={150}
              />
            </Field>
            <Field label="Contractor type" htmlFor="contractor-type" required>
              <Select
                value={form.contractorType}
                onValueChange={(value) => set("contractorType", value as ContractorType)}
                items={CONTRACTOR_TYPE_LABELS}
              >
                <SelectTrigger id="contractor-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTRACTOR_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {isEdit && (
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <Checkbox
                  checked={form.isVerified}
                  onCheckedChange={(checked) => set("isVerified", checked)}
                />
                Verified contractor
              </label>
            )}
          </div>
        )}

        {activeType === "company" && (
          <Field label="Company name" htmlFor="company-name" required>
            <Input
              id="company-name"
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              required
            />
          </Field>
        )}

        <fieldset className="grid gap-4 rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-medium">Address</legend>
          <Field label="Street" htmlFor="addr-line1">
            <Input
              id="addr-line1"
              value={form.line1}
              onChange={(e) => set("line1", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" htmlFor="addr-city" required>
              <Input
                id="addr-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                required
              />
            </Field>
            <Field label="State" htmlFor="addr-state" required>
              <Input
                id="addr-state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                required
              />
            </Field>
            <Field label="ZIP" htmlFor="addr-zip" required>
              <Input
                id="addr-zip"
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                required
              />
            </Field>
          </div>
        </fieldset>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
