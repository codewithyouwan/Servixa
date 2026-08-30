"""Wallet + referrals router — dashboard, top-up (stub), spend, transaction
history, referral link. All routes require a wallet-eligible account
(homeowner or service_provider — see require_wallet_owner).
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_wallet_owner
from app.shared.schemas.common import ApiResponse
from app.shared.schemas.user import UserOut
from app.wallet.schemas.wallet import (
    ReferralInfoOut,
    SpendRequest,
    TopupRequest,
    WalletOut,
    WalletTransactionOut,
    WalletTransactionType,
)
from app.wallet.services import wallet_service
from app.wallet.services.wallet_service import InsufficientBalanceError
from db.database import get_db

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("", response_model=ApiResponse[WalletOut], response_model_by_alias=True)
async def get_wallet(
    user: UserOut = Depends(require_wallet_owner), db: AsyncSession = Depends(get_db)
) -> ApiResponse[WalletOut]:
    summary = await wallet_service.get_wallet_summary(db, uuid.UUID(user.id))
    return ApiResponse(data=summary)


@router.get(
    "/transactions", response_model=ApiResponse[list[WalletTransactionOut]], response_model_by_alias=True
)
async def get_transactions(
    type: WalletTransactionType | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    user: UserOut = Depends(require_wallet_owner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[WalletTransactionOut]]:
    transactions = await wallet_service.list_transactions(db, uuid.UUID(user.id), type, offset=offset)
    return ApiResponse(data=transactions)


@router.post("/topup", response_model=ApiResponse[WalletOut], response_model_by_alias=True)
async def topup(
    body: TopupRequest, user: UserOut = Depends(require_wallet_owner), db: AsyncSession = Depends(get_db)
) -> ApiResponse[WalletOut]:
    # Ledger-only stub — credits immediately, no real payment processor.
    # See db/migrations/005_wallet_referrals.sql for the scope note.
    await wallet_service.credit(db, uuid.UUID(user.id), body.amount, "topup", description="Wallet top-up")
    summary = await wallet_service.get_wallet_summary(db, uuid.UUID(user.id))
    return ApiResponse(data=summary)


@router.post("/spend", response_model=ApiResponse[WalletOut], response_model_by_alias=True)
async def spend(
    body: SpendRequest, user: UserOut = Depends(require_wallet_owner), db: AsyncSession = Depends(get_db)
) -> ApiResponse[WalletOut]:
    try:
        await wallet_service.debit(db, uuid.UUID(user.id), body.amount, body.reason, body.description)
    except InsufficientBalanceError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": {"code": "INSUFFICIENT_BALANCE", "message": "Not enough wallet balance for this spend"}},
        )
    summary = await wallet_service.get_wallet_summary(db, uuid.UUID(user.id))
    return ApiResponse(data=summary)


@router.get("/referral", response_model=ApiResponse[ReferralInfoOut], response_model_by_alias=True)
async def get_referral(
    user: UserOut = Depends(require_wallet_owner), db: AsyncSession = Depends(get_db)
) -> ApiResponse[ReferralInfoOut]:
    info = await wallet_service.get_referral_info(db, uuid.UUID(user.id))
    return ApiResponse(data=info)
