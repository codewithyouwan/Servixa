"use client";

/** Admin roster — list, create, edit, activate/deactivate. Super admins only for writes. */

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, RotateCcw, Search, UserX } from "lucide-react";

import { ADMIN_ROLE_LABELS } from "@/lib/admin/constants";
import { AdminAccountService } from "@/lib/admin/service";
import type { Admin, AdminUpdate } from "@/lib/admin/types";
import { useAdminResource } from "@/lib/admin/use-admin-resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminAuth } from "@/app/components/admin/admin-auth-provider";
import { AdminFormDialog } from "@/app/components/admin/admin-form-dialog";
import { FormError, errorMessage } from "@/app/components/admin/form-parts";

export default function AdminAccountsPage() {
  const { admin: currentAdmin } = useAdminAuth();
  const canManage = currentAdmin?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: admins,
    loading,
    error,
    refresh,
  } = useAdminResource((signal) => AdminAccountService.list(search, signal), [search], 250);

  async function patch(target: Admin, changes: AdminUpdate) {
    setBusyId(target.id);
    setActionError(null);
    try {
      await AdminAccountService.update(target.id, changes);
      refresh();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Admins</h1>
          <p className="text-sm text-muted-foreground">
            Staff accounts with access to this back office.
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus data-icon="inline-start" aria-hidden />
            Create admin
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          aria-label="Search admins"
          className="pl-8"
        />
      </div>

      {!canManage && (
        <p className="text-sm text-muted-foreground">
          Only super admins can create or edit admin accounts.
        </p>
      )}

      <FormError error={actionError} />
      {error ? <FormError error={errorMessage(error)} /> : null}

      {loading && !admins ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : admins && admins.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                {canManage && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((row) => (
                <TableRow key={row.id} className={row.isActive ? undefined : "opacity-60"}>
                  <TableCell>
                    <div className="font-medium">
                      {row.fullName}
                      {row.id === currentAdmin?.id && (
                        <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{row.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ADMIN_ROLE_LABELS[row.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    {row.isActive ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Disabled</Badge>
                    )}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={busyId === row.id}
                              aria-label={`Actions for ${row.fullName}`}
                            >
                              <MoreHorizontal className="size-4" aria-hidden />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditing(row);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="size-4" aria-hidden />
                            Edit
                          </DropdownMenuItem>
                          {/* Self-deactivation is blocked server-side too. */}
                          {row.id !== currentAdmin?.id && (
                            <DropdownMenuItem
                              onClick={() => patch(row, { isActive: !row.isActive })}
                            >
                              {row.isActive ? (
                                <>
                                  <UserX className="size-4" aria-hidden />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="size-4" aria-hidden />
                                  Reactivate
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No admins match this search.</p>
        </div>
      )}

      {currentAdmin && (
        <AdminFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          admin={editing}
          currentAdminId={currentAdmin.id}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
