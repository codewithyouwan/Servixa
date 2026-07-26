"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { AccountType } from "@/app/components/auth/account-type-selector";

type AccountTypeState = [AccountType, Dispatch<SetStateAction<AccountType>>];

const AccountTypeContext = createContext<AccountTypeState | null>(null);

/**
 * Shares the selected account type between the sign-up form (right card)
 * and the brand panel copy (left side), so the panel can react to the
 * user's choice. Pages without this provider (e.g. Login) simply fall
 * back to static content.
 */
export function AccountTypeProvider({ children }: { children: ReactNode }) {
  const state = useState<AccountType>("homeowner");
  return (
    <AccountTypeContext.Provider value={state}>
      {children}
    </AccountTypeContext.Provider>
  );
}

/** Returns the shared state, or null when no provider is present. */
export function useAccountTypeContext(): AccountTypeState | null {
  return useContext(AccountTypeContext);
}
