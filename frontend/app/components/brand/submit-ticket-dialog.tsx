"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { SupportTicketCreate } from "@/lib/types";
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

/** Open to any logged-in role (routers/brand.py: POST /brand/tickets only
 * requires get_current_user, not require_brand) — this is homeowners/
 * contractors contacting the brand. Kept here too so a brand admin can log
 * a ticket on behalf of someone who reached out another way (phone, email). */
export function SubmitTicketDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submittedByName, setSubmittedByName] = useState("");

  function reset() {
    setSubject("");
    setMessage("");
    setSubmittedByName("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !submittedByName.trim()) return;
    setSubmitting(true);
    try {
      const body: SupportTicketCreate = {
        subject: subject.trim(),
        message: message.trim(),
        submittedByName: submittedByName.trim(),
      };
      await BrandService.createTicket(body);
      onCreated();
      setOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Plus data-icon="inline-start" aria-hidden />
        Log a ticket
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a support ticket</DialogTitle>
          <DialogDescription>
            For a question that came in outside the app (phone, email) — or for testing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ticket-name">From</Label>
            <Input
              id="ticket-name"
              value={submittedByName}
              onChange={(e) => setSubmittedByName(e.target.value)}
              placeholder="e.g. Sarah Mitchell"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input id="ticket-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-message">Message</Label>
            <Textarea
              id="ticket-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !subject.trim() || !message.trim() || !submittedByName.trim()}
            >
              {submitting ? "Saving…" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
