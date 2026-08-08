"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { DealerCreate } from "@/lib/brand/types";
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

export function AddDealerDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");

  function reset() {
    setName("");
    setRegion("");
    setContactEmail("");
    setContactPhone("");
    setWebsite("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !region.trim()) return;
    setSubmitting(true);
    try {
      const body: DealerCreate = {
        name: name.trim(),
        region: region.trim(),
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
        website: website.trim() || null,
      };
      await BrandService.createDealer(body);
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
        Add dealer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a dealer or distributor</DialogTitle>
          <DialogDescription>Add an authorized seller or installer to your network.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="dealer-name">Name</Label>
            <Input id="dealer-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dealer-region">Region</Label>
            <Input
              id="dealer-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Austin, TX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dealer-email">Contact email</Label>
              <Input
                id="dealer-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dealer-phone">Contact phone</Label>
              <Input id="dealer-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dealer-website">Website</Label>
            <Input id="dealer-website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !name.trim() || !region.trim()}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
