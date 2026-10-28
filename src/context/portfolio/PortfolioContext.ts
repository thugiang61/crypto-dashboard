import { createContext, use } from "react";

interface PortfolioContext {
  savedCoins: {
    [id: string]: boolean | null
  },
  toggleSavedCoin: (id: string) => void
}

export const PortfolioContext = createContext<PortfolioContext | null>(null);

export default function usePortfolioContext () {
  const ctx = use(PortfolioContext);
  if (!ctx) throw new Error("usePortfolioContext must be used by a component inside PortfolioProvider!");
  return ctx;
}
