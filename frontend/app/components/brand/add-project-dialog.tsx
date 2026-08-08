"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { BrandProjectCreate } from "@/lib/brand/types";
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

export function AddProjectDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [linkedProducts, setLinkedProducts] = useState("");
  const [linkedContractorName, setLinkedContractorName] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setLocation("");
    setCompletionDate("");
    setLinkedProducts("");
    setLinkedContractorName("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const body: BrandProjectCreate = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || null,
        completionDate: completionDate || null,
        linkedProducts: linkedProducts
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        linkedContractorName: linkedContractorName.trim() || null,
      };
      await BrandService.createProject(body);
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
        Add project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a case study</DialogTitle>
          <DialogDescription>Showcase completed work built with your products.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="proj-title">Title</Label>
            <Input id="proj-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-description">Description</Label>
            <Textarea
              id="proj-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="proj-location">Location</Label>
              <Input id="proj-location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-date">Completion date</Label>
              <Input
                id="proj-date"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-products">Products used (comma-separated)</Label>
            <Input
              id="proj-products"
              value={linkedProducts}
              onChange={(e) => setLinkedProducts(e.target.value)}
              placeholder="e.g. Infinity 24 Variable-Speed Heat Pump"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-contractor">Contractor credited (optional)</Label>
            <Input
              id="proj-contractor"
              value={linkedContractorName}
              onChange={(e) => setLinkedContractorName(e.target.value)}
              placeholder="e.g. Austin HVAC Pros"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !title.trim() || !description.trim()}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
