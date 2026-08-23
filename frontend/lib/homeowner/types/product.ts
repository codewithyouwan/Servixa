/**
 * Product-recommendation domain type. Backed by (future)
 * project_product_matches — brandId + productId are the join keys the
 * brand-facing analytics dashboard will aggregate impressions / clicks
 * against.
 */

export type ProductCategorySlug =
  | "wall-ovens"
  | "cooktops"
  | "range-hoods"
  | "fans-and-blowers"
  | "fridges"
  | "microwaves"
  | "dishwashers";

export interface RecommendedProduct {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  category: ProductCategorySlug;
  price: number | null;
  /** Optional first-party image; when null, the UI renders a category icon. */
  imageUrl: string | null;
  /** 0–100 compatibility from the (future) product-matching engine. */
  matchScore: number;
  matchReason: string;
}
