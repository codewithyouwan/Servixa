"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { DocumentCategory, HomeDocumentCreate } from "@/lib/homeowner/types";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_ORDER,
} from "@/lib/homeowner/constants/document-categories";
import { DocumentService } from "@/lib/homeowner/services/document-service";
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

/** No real file upload yet — object storage isn't wired up. This captures
 * the structured metadata a real upload flow would extract/confirm, so the
 * rest of the UI (list, badges, filters) works end to end today and only
 * the storage step needs to be swapped in later. */
export function AddDocumentDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<DocumentCategory>("invoice");
  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [brand, setBrand] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [linkedAppliance, setLinkedAppliance] = useState("");

  function reset() {
    setCategory("invoice");
    setTitle("");
    setVendor("");
    setAmount("");
    setBrand("");
    setExpiresAt("");
    setLinkedAppliance("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const body: HomeDocumentCreate = {
        category,
        title: title.trim(),
        linkedAppliance: linkedAppliance.trim() || null,
        vendor: category === "invoice" ? vendor.trim() || null : null,
        amount: category === "invoice" && amount ? Number(amount) : null,
        brand: category === "warranty" || category === "manual" ? brand.trim() || null : null,
        expiresAt:
          category === "warranty" && expiresAt ? new Date(expiresAt).toISOString() : null,
      };
      await DocumentService.create(body);
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
          <DialogTitle>Add to Home Digital Twin</DialogTitle>
          <DialogDescription>
            Save an invoice, warranty card, photo, or manual for this home.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="doc-category">Category</Label>
            <select
              id="doc-category"
              className={selectClassName}
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            >
              {DOCUMENT_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {DOCUMENT_CATEGORIES[c].singular}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-title">Title</Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Refrigerator warranty card"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-appliance">Linked appliance / system (optional)</Label>
            <Input
              id="doc-appliance"
              value={linkedAppliance}
              onChange={(e) => setLinkedAppliance(e.target.value)}
              placeholder="e.g. HVAC System"
            />
          </div>

          {category === "invoice" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="doc-vendor">Vendor</Label>
                <Input
                  id="doc-vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. Amazon.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="doc-amount">Amount</Label>
                <Input
                  id="doc-amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {(category === "warranty" || category === "manual") && (
            <div className="space-y-1.5">
              <Label htmlFor="doc-brand">Brand</Label>
              <Input
                id="doc-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung"
              />
            </div>
          )}

          {category === "warranty" && (
            <div className="space-y-1.5">
              <Label htmlFor="doc-expires">Expires on</Label>
              <Input
                id="doc-expires"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
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
