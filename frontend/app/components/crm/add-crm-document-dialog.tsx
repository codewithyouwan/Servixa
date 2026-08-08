"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { CrmDocumentCategory, CrmDocumentCreate } from "@/lib/types";
import {
  CRM_DOCUMENT_CATEGORIES,
  CRM_DOCUMENT_CATEGORY_ORDER,
} from "@/lib/constants/crm-document-categories";
import { CrmService } from "@/lib/services/crm-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

/** Same approach as Feature 1's AddDocumentDialog — no real file upload yet
 * (no object storage wired up), so this captures the structured metadata a
 * real upload flow would extract/confirm. */
export function AddCrmDocumentDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<CrmDocumentCategory>("license");
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [linkedCustomer, setLinkedCustomer] = useState("");

  function reset() {
    setCategory("license");
    setTitle("");
    setIssuer("");
    setExpiresAt("");
    setLinkedCustomer("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const body: CrmDocumentCreate = {
        category,
        title: title.trim(),
        issuer: category === "license" || category === "insurance" ? issuer.trim() || null : null,
        expiresAt:
          (category === "license" || category === "insurance") && expiresAt
            ? new Date(expiresAt).toISOString()
            : null,
        linkedCustomer:
          category === "contract" || category === "photo" ? linkedCustomer.trim() || null : null,
      };
      await CrmService.createDocument(body);
      onCreated();
      setOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" aria-hidden />
        Add document
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a business document</DialogTitle>
          <DialogDescription>
            Save a license, insurance policy, signed contract, or job photo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="crmdoc-category">Category</Label>
            <select
              id="crmdoc-category"
              className={selectClassName}
              value={category}
              onChange={(e) => setCategory(e.target.value as CrmDocumentCategory)}
            >
              {CRM_DOCUMENT_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CRM_DOCUMENT_CATEGORIES[c].singular}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="crmdoc-title">Title</Label>
            <Input
              id="crmdoc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. General Liability Insurance"
              required
            />
          </div>

          {(category === "license" || category === "insurance") && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="crmdoc-issuer">Issued by</Label>
                <Input
                  id="crmdoc-issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. State licensing board"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="crmdoc-expires">Expires on</Label>
                <Input
                  id="crmdoc-expires"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
          )}

          {(category === "contract" || category === "photo") && (
            <div className="space-y-1.5">
              <Label htmlFor="crmdoc-customer">Linked customer (optional)</Label>
              <Input
                id="crmdoc-customer"
                value={linkedCustomer}
                onChange={(e) => setLinkedCustomer(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !title.trim()}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
