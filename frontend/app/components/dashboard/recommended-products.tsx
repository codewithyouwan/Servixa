"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Fan,
  Flame,
  Microwave,
  Package,
  Refrigerator,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";

import type { ProductCategorySlug, RecommendedProduct } from "@/lib/homeowner/types";
import { ROUTES } from "@/lib/constants/routes";
import { formatCurrency } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/app/components/shared/states";

const CATEGORY_META: Record<
  ProductCategorySlug,
  { label: string; icon: LucideIcon; gradient: string }
> = {
  "wall-ovens": {
    label: "Wall Ovens",
    icon: CookingPot,
    gradient: "from-amber-500/25 via-orange-500/15 to-red-500/25",
  },
  cooktops: {
    label: "Cooktops",
    icon: Flame,
    gradient: "from-rose-500/25 via-orange-500/15 to-amber-500/25",
  },
  "range-hoods": {
    label: "Range Hoods",
    icon: Wind,
    gradient: "from-slate-500/25 via-sky-500/15 to-cyan-500/25",
  },
  "fans-and-blowers": {
    label: "Fans & Blowers",
    icon: Fan,
    gradient: "from-sky-500/25 via-indigo-500/15 to-violet-500/25",
  },
  fridges: {
    label: "Fridges",
    icon: Refrigerator,
    gradient: "from-cyan-500/25 via-teal-500/15 to-emerald-500/25",
  },
  microwaves: {
    label: "Microwaves",
    icon: Microwave,
    gradient: "from-violet-500/25 via-fuchsia-500/15 to-pink-500/25",
  },
  dishwashers: {
    label: "Dishwashers",
    icon: Sparkles,
    gradient: "from-emerald-500/25 via-teal-500/15 to-cyan-500/25",
  },
};

function ProductCard({ product }: { product: RecommendedProduct }) {
  const meta = CATEGORY_META[product.category];
  const Icon = meta.icon;

  return (
    <Link
      // TODO: swap for a homeowner-facing product route once it exists — the
      // brand catalog is the closest current destination. brandId + product.id
      // ride along as query params so the brand analytics page can attribute
      // the click.
      href={`/pages/brand/products?brand=${product.brandId}&product=${product.id}&src=homeowner-recs`}
      className="group flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border/60 transition-all hover:border-border hover:shadow-sm"
    >
      <div
        className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${meta.gradient}`}
        aria-hidden
      >
        <Icon className="size-12 text-foreground/70" strokeWidth={1.5} />
        <Badge variant="accent" className="absolute top-2 right-2">
          {product.matchScore}% match
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-xs text-muted-foreground">{meta.label}</p>
        <p className="line-clamp-2 text-sm font-medium group-hover:text-primary">
          {product.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{product.brandName}</p>
        <p className="mt-auto flex items-baseline justify-between gap-2 pt-1.5">
          {product.price != null ? (
            <span className="text-sm font-semibold tabular-nums">
              {formatCurrency(product.price)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Contact for pricing</span>
          )}
          <span className="line-clamp-1 text-[11px] text-muted-foreground">
            {product.matchReason}
          </span>
        </p>
      </div>
    </Link>
  );
}

export function RecommendedProducts({ products }: { products: RecommendedProduct[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Products</CardTitle>
        <CardAction>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll products left"
              disabled={products.length === 0}
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => scrollBy(1)}
              aria-label="Scroll products right"
              disabled={products.length === 0}
            >
              <ChevronRight aria-hidden />
            </Button>
            <Button variant="ghost" size="sm" render={<Link href={ROUTES.digitalTwin} />}>
              Browse all
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No product recommendations yet"
            description="As you post projects and add appliances to your Digital Twin, matched brand products will show up here."
          />
        ) : (
          <div
            ref={scrollerRef}
            className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
