"""Async data-access functions for the service-provider CRM
(crm_leads/crm_quotes/crm_invoices — schema.sql, unchanged)."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Category, CrmInvoice, CrmLead, CrmQuote


async def list_leads(session: AsyncSession, provider_id: uuid.UUID) -> list[CrmLead]:
    result = await session.execute(select(CrmLead).where(CrmLead.provider_id == provider_id).order_by(CrmLead.created_at.desc()))
    return list(result.scalars().all())


async def get_lead(session: AsyncSession, provider_id: uuid.UUID, lead_id: uuid.UUID) -> CrmLead | None:
    result = await session.execute(select(CrmLead).where(CrmLead.lead_id == lead_id, CrmLead.provider_id == provider_id))
    return result.scalar_one_or_none()


async def list_quotes(session: AsyncSession, provider_id: uuid.UUID) -> list[CrmQuote]:
    result = await session.execute(select(CrmQuote).where(CrmQuote.provider_id == provider_id).order_by(CrmQuote.created_at.desc()))
    return list(result.scalars().all())


async def create_quote(session: AsyncSession, quote: CrmQuote) -> CrmQuote:
    session.add(quote)
    await session.flush()
    return quote


async def list_invoices(session: AsyncSession, provider_id: uuid.UUID) -> list[CrmInvoice]:
    result = await session.execute(select(CrmInvoice).where(CrmInvoice.provider_id == provider_id).order_by(CrmInvoice.created_at.desc()))
    return list(result.scalars().all())


async def get_invoice(session: AsyncSession, provider_id: uuid.UUID, invoice_id: uuid.UUID) -> CrmInvoice | None:
    result = await session.execute(
        select(CrmInvoice).where(CrmInvoice.invoice_id == invoice_id, CrmInvoice.provider_id == provider_id)
    )
    return result.scalar_one_or_none()


async def category_name(session: AsyncSession, category_id: uuid.UUID | None) -> str:
    if category_id is None:
        return "General"
    result = await session.execute(select(Category.name).where(Category.category_id == category_id))
    return result.scalar_one_or_none() or "General"
