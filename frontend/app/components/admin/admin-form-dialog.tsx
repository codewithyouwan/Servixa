"use client";

/** Create/edit an admin account. Writes are super-admin-only server-side. */

import { useState, type FormEvent } from "react";

import {
  ADMIN_ROLE_DESCRIPTIONS,
  ADMIN_ROLE_LABELS,
  PASSWORD_MIN_LENGTH,
} from "@/lib/admin/constants";
import { AdminAccountService } from "@/lib/admin/service";
import type { Admin, AdminRole } from "@/lib/admin/types";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create; provide to edit. */
  admin?: Admin | null;
  /** The signed-in admin — used to block self-lockout in the UI. */
  currentAdminId: string;
  onSaved: () => void;
}

export function AdminFormDialog({ open, onOpenChange, admin, currentAdminId, onSaved }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Keyed + mounted only while open so state seeds once on mount. */}
        {open && (
          <AdminForm
            key={admin?.id ?? "new"}
            admin={admin ?? null}
            currentAdminId={currentAdminId}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AdminForm({
  admin,
  currentAdminId,
  onOpenChange,
  onSaved,
}: {
  admin: Admin | null;
  currentAdminId: string;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(admin);
  const isSelf = admin?.id === currentAdminId;

  const [fullName, setFullName] = useState(admin?.fullName ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>(admin?.role ?? "moderator");
  const [isActive, setIsActive] = useState(admin?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (admin) {
        await AdminAccountService.update(admin.id, {
          fullName,
          // The server rejects self role/status changes; don't even send them.
          ...(isSelf ? {} : { role, isActive }),
          ...(password ? { password } : {}),
        });
      } else {
        await AdminAccountService.create({ email, fullName, password, role });
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit admin" : "Create admin"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update this admin account."
            : "Admins sign in to this back office. Email cannot be changed later."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormError error={error} />

        <Field label="Full name" htmlFor="admin-name" required>
          <Input
            id="admin-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={100}
          />
        </Field>

        {!isEdit && (
          <Field label="Email" htmlFor="admin-email" required>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
        )}

        <Field
          label={isEdit ? "New password" : "Password"}
          htmlFor="admin-password"
          required={!isEdit}
          hint={
            isEdit
              ? "Leave blank to keep the current password."
              : `At least ${PASSWORD_MIN_LENGTH} characters.`
          }
        >
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEdit}
            minLength={!isEdit || password ? PASSWORD_MIN_LENGTH : undefined}
            autoComplete="new-password"
          />
        </Field>

        <Field label="Role" htmlFor="admin-role" required hint={ADMIN_ROLE_DESCRIPTIONS[role]}>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as AdminRole)}
            items={ADMIN_ROLE_LABELS}
            disabled={isSelf}
          >
            <SelectTrigger id="admin-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ADMIN_ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {isEdit && (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isActive} onCheckedChange={setIsActive} disabled={isSelf} />
            Active
          </label>
        )}

        {isSelf && (
          <p className="text-xs text-muted-foreground">
            You cannot change your own role or deactivate yourself — ask another super admin.
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create admin"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
