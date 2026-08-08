"use client";

import { useState } from "react";
import { Plus, Sparkles, Trash2 } from "lucide-react";

import type { Lead, QuoteLineItem } from "@/lib/types";
import { CrmService } from "@/lib/services/crm-service";
import { formatCurrency } from "@/lib/utils/format";
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

const emptyLineItem = (): QuoteLineItem => ({ description: "", quantity: 1, unitPrice: 0 });

/** AI Quote Builder. Given a lead, drafts line items from the backend's
 * category-price-template heuristic (see crm_service.generate_ai_quote_draft
 * — a stand-in for a real model call, since no AI provider is configured in
 * this repo yet) and lets the contractor review/edit before sending. Without
 * a lead (triggered from the Quotes tab directly) it's just a manual form. */
export function AiQuoteBuilderDialog({
  lead,
  onCreated,
}: {
  lead?: Lead;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState(lead?.customerName ?? "");
  const [title, setTitle] = useState(lead?.projectTitle ?? "");
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([emptyLineItem()]);
  const [aiGenerated, setAiGenerated] = useState(false);

  const amount = lineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  function reset() {
    setCustomerName(lead?.customerName ?? "");
    setTitle(lead?.projectTitle ?? "");
    setLineItems([emptyLineItem()]);
    setAiGenerated(false);
  }

  async function generateWithAi() {
    if (!lead) return;
    setGenerating(true);
    try {
      const draft = await CrmService.aiQuoteDraft(lead.id);
      setTitle(draft.title);
      setLineItems(draft.lineItems);
      setAiGenerated(true);
    } finally {
      setGenerating(false);
    }
  }

  function updateLine(index: number, patch: Partial<QuoteLineItem>) {
    setLineItems((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    setAiGenerated(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const items = lineItems.filter((i) => i.description.trim());
    if (!customerName.trim() || !title.trim() || items.length === 0) return;
    setSubmitting(true);
    try {
      await CrmService.createQuote({
        leadId: lead?.id ?? null,
        customerName: customerName.trim(),
        title: title.trim(),
        lineItems: items,
        aiGenerated,
      });
      onCreated();
      setOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        {lead ? "Build Quote" : (
          <>
            <Plus data-icon="inline-start" aria-hidden />
            New Quote
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead ? "AI Quote Builder" : "New quote"}</DialogTitle>
          <DialogDescription>
            {lead
              ? "Generate a draft from this lead, then review and send."
              : "Build a quote for a customer."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="qb-customer">Customer</Label>
              <Input
                id="qb-customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={!!lead}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qb-title">Title</Label>
              <Input id="qb-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
          </div>

          {lead && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateWithAi}
              disabled={generating}
            >
              <Sparkles data-icon="inline-start" aria-hidden />
              {generating ? "Generating…" : "Generate with AI"}
            </Button>
          )}

          <div className="space-y-2">
            <Label>Line items</Label>
            {lineItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Input
                  value={item.description}
                  onChange={(e) => updateLine(i, { description: e.target.value })}
                  placeholder="Description"
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.quantity}
                  onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
                  className="w-16"
                  aria-label="Quantity"
                />
                <Input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })}
                  className="w-24"
                  aria-label="Unit price"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove line item"
                  onClick={() => setLineItems((items) => items.filter((_, idx) => idx !== i))}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setLineItems((items) => [...items, emptyLineItem()])}
            >
              <Plus data-icon="inline-start" aria-hidden />
              Add line item
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(amount)}</span>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Sending…" : "Send quote"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
