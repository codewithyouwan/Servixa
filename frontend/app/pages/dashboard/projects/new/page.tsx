"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_CATEGORIES } from "@/lib/constants/service-categories";
import { ROUTES } from "@/lib/constants/routes";
import { ProjectService } from "@/lib/homeowner/services/project-service";
import type { ServiceCategorySlug } from "@/lib/homeowner/types";
import { ApiError } from "@/lib/types";

/**
 * Project intake form — posts directly to POST /api/v1/projects (real,
 * DB-backed). The "AI-guided" scope-of-work generation this page's
 * comment used to promise is a separate, later feature; this ships the
 * real intake so homeowners can actually post a project today.
 */
export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceCategorySlug | "">("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !category || !description.trim() || !location.trim()) {
      setError("Please fill in every field.");
      return;
    }
    const min = Number(budgetMin);
    const max = Number(budgetMax);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) {
      setError("Enter a valid budget range.");
      return;
    }
    if (min > max) {
      setError("Minimum budget can't be more than the maximum.");
      return;
    }

    setIsSubmitting(true);
    try {
      const project = await ProjectService.create({
        title: title.trim(),
        category,
        description: description.trim(),
        budgetMin: min,
        budgetMax: max,
        location: location.trim(),
      });
      router.push(`${ROUTES.projects}/${project.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Couldn't post your project. Please try again.");
      } else {
        setError("Couldn't reach the server. Is the backend running?");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Post a Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what you need done — we&apos;ll match you with verified providers near you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
        noValidate
      >
        <div className="space-y-1.5">
          <Label htmlFor="project-title">Project title</Label>
          <Input
            id="project-title"
            placeholder="e.g. Kitchen Renovation"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ServiceCategorySlug)}
          >
            <SelectTrigger id="project-category" className="h-10 w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-description">Description</Label>
          <Textarea
            id="project-description"
            placeholder="Describe the scope of work — what needs to be done, materials, timeline, anything a provider should know."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="project-budget-min">Budget min ($)</Label>
            <Input
              id="project-budget-min"
              type="number"
              min={0}
              placeholder="5000"
              value={budgetMin}
              onChange={(event) => setBudgetMin(event.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-budget-max">Budget max ($)</Label>
            <Input
              id="project-budget-max"
              type="number"
              min={0}
              placeholder="15000"
              value={budgetMax}
              onChange={(event) => setBudgetMax(event.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-location">Location</Label>
          <Input
            id="project-location"
            placeholder="e.g. Austin, TX"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="h-10"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="group h-10 w-full rounded-lg">
          {isSubmitting ? "Posting…" : "Post Project"}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Button>
      </form>
    </div>
  );
}
