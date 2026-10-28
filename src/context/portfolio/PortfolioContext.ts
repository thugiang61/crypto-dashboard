import { createContext, use } from "react";

interface PortfolioContext {
  savedCoins: {
    [id: string]: boolean | null // dùg maket_cap_rank có coin ko có nên ko dùg đc mà chx qua dùg id của coin mà vẫn đảm bảo tính unique
  },
  // addSavedCoin: (id: number) => void
  // removeSavedCoin: (id: number) => void
  // toggleSavedCoin: (id: number) => void
  toggleSavedCoin: (id: string) => void
}

export const PortfolioContext = createContext<PortfolioContext | null>(null);

export default function usePortfolioContext () {
  const ctx = use(PortfolioContext);
  if (!ctx) throw new Error("usePortfolioContext must be used by a component inside PortfolioProvider!");
  return ctx;
}

