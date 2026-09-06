"""Recommended-product schema — mirrors frontend/lib/homeowner/types/product.ts."""

from app.shared.schemas.user import CamelModel


class RecommendedProductOut(CamelModel):
    id: str
    brand_id: str
    brand_name: str
    name: str
    category: str
    price: int | None = None
    image_url: str | None = None
    match_score: int
    match_reason: str
