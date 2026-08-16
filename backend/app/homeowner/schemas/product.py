"""Product-recommendation schema — mirrors frontend/lib/homeowner/types/product.ts.

That type's own docstring already flags this as backed by a "(future)"
product-matching engine (project_product_matches, reserved but unbuilt —
see db/schema.sql's AI RECOMMENDATION ENGINE region). No matching logic
exists yet, so the dashboard always returns an empty list here — this
schema exists so the response shape is complete, not to fake a result.
"""

from typing import Literal

from app.shared.schemas.user import CamelModel

ProductCategorySlug = Literal[
    "wall-ovens", "cooktops", "range-hoods", "fans-and-blowers",
    "fridges", "microwaves", "dishwashers",
]


class RecommendedProductOut(CamelModel):
    id: str
    brand_id: str
    brand_name: str
    name: str
    category: ProductCategorySlug
    price: int | None = None
    image_url: str | None = None
    match_score: int
    match_reason: str
