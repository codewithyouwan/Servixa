"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import type { BrandOverview, BrandOverviewUpdate } from "@/lib/types";
import { BrandService } from "@/lib/services/brand-service";
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

/** Editable by the brand admin only (routers/brand.py gates PATCH behind
 * require_brand) — this is the "editable by brand admin; public-facing
 * summary" behavior from the plan. */
export function EditOverviewDialog({
  overview,
  onSaved,
}: {
  overview: BrandOverview;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tagline, setTagline] = useState(overview.tagline);
  const [description, setDescription] = useState(overview.description);
  const [website, setWebsite] = useState(overview.website ?? "");
  const [foundedYear, setFoundedYear] = useState(overview.foundedYear?.toString() ?? "");
  const [certifications, setCertifications] = useState(overview.certifications.join(", "));
  const [contactEmail, setContactEmail] = useState(overview.contactEmail);
  const [contactPhone, setContactPhone] = useState(overview.contactPhone ?? "");
  const [headquarters, setHeadquarters] = useState(overview.headquarters ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: BrandOverviewUpdate = {
        tagline: tagline.trim(),
        description: description.trim(),
        website: website.trim() || null,
        foundedYear: foundedYear ? Number(foundedYear) : null,
        certifications: certifications
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || null,
        headquarters: headquarters.trim() || null,
      };
      await BrandService.updateOverview(body);
      onSaved();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil data-icon="inline-start" aria-hidden />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit company overview</DialogTitle>
          <DialogDescription>
            This is your public-facing summary — shown to homeowners and contractors browsing your
            profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ov-tagline">Tagline</Label>
            <Input id="ov-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ov-description">Description</Label>
            <Textarea
              id="ov-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ov-website">Website</Label>
              <Input id="ov-website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ov-founded">Founded year</Label>
              <Input
                id="ov-founded"
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ov-certs">Certifications (comma-separated)</Label>
            <Input
              id="ov-certs"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="e.g. ENERGY STAR Partner, AHRI Certified"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ov-email">Contact email</Label>
              <Input
                id="ov-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ov-phone">Contact phone</Label>
              <Input id="ov-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ov-hq">Headquarters</Label>
            <Input id="ov-hq" value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
