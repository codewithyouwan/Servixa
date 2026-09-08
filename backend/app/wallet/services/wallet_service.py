"""Wallet ledger service — the only place that mutates wallet balances.

Every credit/debit is one commit: lock the wallet row (SELECT ... FOR
UPDATE), compute the new balance, write both the wallets.balance update and
the wallet_transactions row together. The row lock is what prevents two
concurrent spends from both reading a stale balance and overdrawing it —
the one place in this app so far where a real race condition matters.
"""

import random
import string
import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.wallet.schemas.wallet import (
    ReferralInfoOut,
    WalletOut,
    WalletSpendReason,
    WalletTransactionOut,
    WalletTransactionType,
)
from db.models import Referral, User, Wallet, WalletTransaction

RECENT_TRANSACTIONS_LIMIT = 10
TRANSACTIONS_PAGE_SIZE = 20
REFERRAL_CODE_ALPHABET = string.ascii_uppercase + string.digits
REFERRAL_CODE_LENGTH = 8


class InsufficientBalanceError(Exception):
    pass


async def get_or_create_wallet(db: AsyncSession, user_id: uuid.UUID) -> Wallet:
    result = await db.execute(select(Wallet).where(Wallet.user_id == user_id))
    wallet = result.scalar_one_or_none()
    if wallet is None:
        wallet = Wallet(user_id=user_id, balance=0)
        db.add(wallet)
        await db.flush()
    return wallet


async def _locked_wallet(db: AsyncSession, user_id: uuid.UUID) -> Wallet:
    """Lock the wallet row for the duration of this transaction."""
    result = await db.execute(select(Wallet).where(Wallet.user_id == user_id).with_for_update())
    wallet = result.scalar_one_or_none()
    if wallet is None:
        wallet = Wallet(user_id=user_id, balance=0)
        db.add(wallet)
        await db.flush()
        result = await db.execute(select(Wallet).where(Wallet.user_id == user_id).with_for_update())
        wallet = result.scalar_one()
    return wallet


async def credit(
    db: AsyncSession,
    user_id: uuid.UUID,
    amount: int,
    type_: WalletTransactionType,
    description: str | None = None,
    related_user_id: uuid.UUID | None = None,
) -> WalletTransaction:
    wallet = await _locked_wallet(db, user_id)
    wallet.balance += amount
    txn = WalletTransaction(
        user_id=user_id,
        type=type_,
        amount=amount,
        balance_after=wallet.balance,
        description=description,
        related_user_id=related_user_id,
    )
    db.add(txn)
    await db.flush()
    return txn


async def debit(
    db: AsyncSession,
    user_id: uuid.UUID,
    amount: int,
    reason: WalletSpendReason,
    description: str | None = None,
) -> WalletTransaction:
    wallet = await _locked_wallet(db, user_id)
    if wallet.balance < amount:
        raise InsufficientBalanceError(f"Balance {wallet.balance} is less than requested spend {amount}")
    wallet.balance -= amount
    txn = WalletTransaction(
        user_id=user_id,
        type="spend",
        amount=-amount,
        balance_after=wallet.balance,
        reason=reason,
        description=description,
    )
    db.add(txn)
    await db.flush()
    return txn


async def generate_referral_code(db: AsyncSession) -> str:
    for _ in range(10):
        code = "".join(random.choices(REFERRAL_CODE_ALPHABET, k=REFERRAL_CODE_LENGTH))
        existing = await db.execute(select(User.user_id).where(User.referral_code == code))
        if existing.scalar_one_or_none() is None:
            return code
    raise RuntimeError("Could not generate a unique referral code after 10 attempts")


async def record_referral(
    db: AsyncSession, referrer_user_id: uuid.UUID, referred_user_id: uuid.UUID, reward_amount: int
) -> None:
    db.add(
        Referral(
            referrer_user_id=referrer_user_id,
            referred_user_id=referred_user_id,
            reward_amount=reward_amount,
        )
    )
    await credit(
        db, referrer_user_id, reward_amount, "referral_reward",
        description="Referral reward", related_user_id=referred_user_id,
    )


def _txn_to_out(txn: WalletTransaction) -> WalletTransactionOut:
    return WalletTransactionOut(
        id=str(txn.transaction_id),
        type=txn.type,
        amount=txn.amount,
        balance_after=txn.balance_after,
        reason=txn.reason,
        description=txn.description,
        created_at=txn.created_at.isoformat(),
    )


async def get_wallet_summary(db: AsyncSession, user_id: uuid.UUID) -> WalletOut:
    wallet = await get_or_create_wallet(db, user_id)

    lifetime_result = await db.execute(
        select(func.coalesce(func.sum(WalletTransaction.amount), 0)).where(
            WalletTransaction.user_id == user_id, WalletTransaction.amount > 0
        )
    )
    lifetime_earned = lifetime_result.scalar_one()

    recent_result = await db.execute(
        select(WalletTransaction)
        .where(WalletTransaction.user_id == user_id)
        .order_by(WalletTransaction.created_at.desc())
        .limit(RECENT_TRANSACTIONS_LIMIT)
    )
    recent = [_txn_to_out(t) for t in recent_result.scalars().all()]

    return WalletOut(balance=wallet.balance, lifetime_earned=lifetime_earned, recent_transactions=recent)


async def list_transactions(
    db: AsyncSession, user_id: uuid.UUID, type_filter: WalletTransactionType | None = None,
    limit: int = TRANSACTIONS_PAGE_SIZE, offset: int = 0,
) -> list[WalletTransactionOut]:
    query = select(WalletTransaction).where(WalletTransaction.user_id == user_id)
    if type_filter is not None:
        query = query.where(WalletTransaction.type == type_filter)
    query = query.order_by(WalletTransaction.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return [_txn_to_out(t) for t in result.scalars().all()]


async def get_referral_info(db: AsyncSession, user_id: uuid.UUID) -> ReferralInfoOut:
    user_result = await db.execute(select(User).where(User.user_id == user_id))
    user = user_result.scalar_one()
    if not user.referral_code:
        # Self-healing for accounts that predate this feature (e.g. seeded
        # dev users created directly, not through /auth/register).
        user.referral_code = await generate_referral_code(db)
        await db.flush()
    code = user.referral_code

    count_result = await db.execute(
        select(func.count(Referral.referral_id)).where(Referral.referrer_user_id == user_id)
    )
    total_referrals = count_result.scalar_one()

    earnings_result = await db.execute(
        select(func.coalesce(func.sum(Referral.reward_amount), 0)).where(Referral.referrer_user_id == user_id)
    )
    lifetime_earnings = earnings_result.scalar_one()

    return ReferralInfoOut(code=code, total_referrals=total_referrals, lifetime_earnings=lifetime_earnings)
