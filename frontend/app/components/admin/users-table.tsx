"use client";

import { BadgeCheck, MoreHorizontal, Pencil, RotateCcw, ShieldOff, UserX } from "lucide-react";

import { CONTRACTOR_TYPE_LABELS, USER_TYPE_LABELS } from "@/lib/admin/constants";
import type { ManagedUser } from "@/lib/admin/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** The type-specific line under the name — different table per account type. */
function detailFor(user: ManagedUser): string | null {
  if (user.type === "contractor" && user.businessName) {
    const kind = user.contractorType ? CONTRACTOR_TYPE_LABELS[user.contractorType] : null;
    return kind ? `${user.businessName} · ${kind}` : user.businessName;
  }
  if (user.type === "company") return user.companyName ?? null;
  return null;
}

interface Props {
  users: ManagedUser[];
  onEdit: (user: ManagedUser) => void;
  onToggleActive: (user: ManagedUser) => void;
  onToggleVerified: (user: ManagedUser) => void;
  busyId: string | null;
}

export function UsersTable({ users, onEdit, onToggleActive, onToggleVerified, busyId }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const detail = detailFor(user);
            return (
              <TableRow key={user.id} className={user.isDeleted ? "opacity-60" : undefined}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{USER_TYPE_LABELS[user.type]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {user.isDeleted ? (
                      <Badge variant="destructive">Deactivated</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                    {user.type === "contractor" && user.isVerified && (
                      <Badge variant="outline" className="gap-1">
                        <BadgeCheck className="size-3" aria-hidden />
                        Verified
                      </Badge>
                    )}
                    {!user.hasPassword && (
                      <Badge variant="outline" className="text-muted-foreground">
                        No password
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busyId === user.id}
                          aria-label={`Actions for ${user.name}`}
                        >
                          <MoreHorizontal className="size-4" aria-hidden />
                        </Button>
                      }
                    />
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="size-4" aria-hidden />
                        Edit
                      </DropdownMenuItem>
                      {user.type === "contractor" && (
                        <DropdownMenuItem onClick={() => onToggleVerified(user)}>
                          {user.isVerified ? (
                            <>
                              <ShieldOff className="size-4" aria-hidden />
                              Remove verification
                            </>
                          ) : (
                            <>
                              <BadgeCheck className="size-4" aria-hidden />
                              Mark verified
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onToggleActive(user)}>
                        {user.isDeleted ? (
                          <>
                            <RotateCcw className="size-4" aria-hidden />
                            Reactivate
                          </>
                        ) : (
                          <>
                            <UserX className="size-4" aria-hidden />
                            Deactivate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
