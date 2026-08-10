"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { BrandDownloadCreate, DownloadCategory } from "@/lib/brand/types";
import { DOWNLOAD_CATEGORIES, DOWNLOAD_CATEGORY_ORDER } from "@/lib/brand/constants";
import { BrandService } from "@/lib/brand/services/brand-service";
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

/** Same approach as the Home Digital Twin / CRM Documents dialogs — no real
 * file upload yet (no object storage wired up), so this captures the
 * structured metadata a real upload flow would extract/confirm. */
export function AddDownloadDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<DownloadCategory>("manual");
  const [title, setTitle] = useState("");
  const [linkedProductName, setLinkedProductName] = useState("");

  function reset() {
    setCategory("manual");
    setTitle("");
    setLinkedProductName("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const body: BrandDownloadCreate = {
        category,
        title: title.trim(),
        linkedProductName: linkedProductName.trim() || null,
      };
      await BrandService.createDownload(body);
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
        Add download
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a download</DialogTitle>
          <DialogDescription>Add a manual, spec sheet, install guide, or marketing asset.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="dl-category">Category</Label>
            <select
              id="dl-category"
              className={selectClassName}
              value={category}
              onChange={(e) => setCategory(e.target.value as DownloadCategory)}
            >
              {DOWNLOAD_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {DOWNLOAD_CATEGORIES[c].singular}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dl-title">Title</Label>
            <Input
              id="dl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Infinity 24 Heat Pump — Owner's Manual"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dl-product">Linked product (optional)</Label>
            <Input
              id="dl-product"
              value={linkedProductName}
              onChange={(e) => setLinkedProductName(e.target.value)}
              placeholder="e.g. Infinity 24 Variable-Speed Heat Pump"
            />
          </div>

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
