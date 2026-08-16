"use client";

/** Marketplace user management — list, create, edit, deactivate, verify. */

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { USER_TYPE_LABELS } from "@/lib/admin/constants";
import { AdminUserService } from "@/lib/admin/service";
import type { ManagedUser, UserType } from "@/lib/admin/types";
import { useAdminResource } from "@/lib/admin/use-admin-resource";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError, errorMessage } from "@/app/components/admin/form-parts";
import { UserFormDialog } from "@/app/components/admin/user-form-dialog";
import { UsersTable } from "@/app/components/admin/users-table";

const ALL = "all";
const TYPE_FILTER_LABELS = { [ALL]: "All types", ...USER_TYPE_LABELS };

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<UserType | typeof ALL>(ALL);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: users,
    loading,
    error,
    refresh,
  } = useAdminResource(
    (signal) =>
      AdminUserService.list(
        {
          type: typeFilter === ALL ? undefined : typeFilter,
          search,
          includeDeleted,
        },
        signal,
      ),
    [search, typeFilter, includeDeleted],
    // Debounce so typing in the search box doesn't fire a request per keystroke.
    250,
  );

  /** Row actions are single-field patches; the dialog handles everything else. */
  async function patch(user: ManagedUser, changes: Parameters<typeof AdminUserService.update>[1]) {
    setBusyId(user.id);
    setActionError(null);
    try {
      await AdminUserService.update(user.id, changes);
      refresh();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(user: ManagedUser) {
    setEditing(user);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Homeowners, contractors, and companies on the marketplace.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" aria-hidden />
          Create user
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search users"
            className="pl-8"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as UserType | typeof ALL)}
          items={TYPE_FILTER_LABELS}
        >
          <SelectTrigger aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_FILTER_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
          <Checkbox checked={includeDeleted} onCheckedChange={setIncludeDeleted} />
          Show deactivated
        </label>
      </div>

      <FormError error={actionError} />
      {error ? <FormError error={errorMessage(error)} /> : null}

      {loading && !users ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <UsersTable
          users={users}
          busyId={busyId}
          onEdit={openEdit}
          onToggleActive={(user) => patch(user, { isDeleted: !user.isDeleted })}
          onToggleVerified={(user) => patch(user, { isVerified: !user.isVerified })}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {search || typeFilter !== ALL
              ? "No users match these filters."
              : "No users yet. Create the first one."}
          </p>
        </div>
      )}

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editing}
        onSaved={refresh}
      />
    </div>
  );
}
