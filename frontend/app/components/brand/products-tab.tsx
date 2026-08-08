"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";

import type { BrandProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/app/components/dashboard/states";
import { AddProductDialog } from "./add-product-dialog";

export function ProductsTab({
  products,
  onChange,
}: {
  products: BrandProduct[];
  onChange: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      )
    : products;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search products or categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <AddProductDialog onCreated={onChange} />
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add the products and services your brand offers — homeowners and contractors will be able to browse this catalog."
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No matches" description="Try a different search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <Card key={product.id} size="sm">
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{product.name}</p>
                  <Badge
                    variant="muted"
                    className={
                      product.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {product.status === "active" ? "Active" : "Discontinued"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                {product.price != null && (
                  <p className="text-sm font-medium tabular-nums">{formatCurrency(product.price)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
