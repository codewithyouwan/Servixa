"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { BrandProductCreate } from "@/lib/brand/types";
import { BrandService } from "@/lib/brand/services/brand-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function AddProductDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"active" | "discontinued">("active");

  function reset() {
    setName("");
    setCategory("");
    setDescription("");
    setPrice("");
    setStatus("active");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const body: BrandProductCreate = {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: price ? Number(price) : null,
        status,
      };
      await BrandService.createProduct(body);
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
        Add product
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a product</DialogTitle>
          <DialogDescription>Add an item to your catalog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="prod-name">Name</Label>
            <Input id="prod-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-category">Category</Label>
              <Input
                id="prod-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Heat Pumps"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-price">Price</Label>
              <Input id="prod-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-description">Description</Label>
            <Textarea
              id="prod-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-status">Status</Label>
            <select
              id="prod-status"
              className={selectClassName}
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "discontinued")}
            >
              <option value="active">Active</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !name.trim() || !category.trim()}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
