import { useState, type ReactNode } from "react";
import { PortfolioContext } from "@/context/portfolio/PortfolioContext";

interface PortfolioProviderProps {
  children: ReactNode
}

export default function PortfolioProvider ({children}: PortfolioProviderProps) {
  const [savedCoins, setSavedCoins] = useState<{[id: string]: boolean | null}>(() => {
    const savedCoins = localStorage.getItem("savedCoins");
    return  savedCoins ? JSON.parse(savedCoins) : {};
  });



  function toggleSavedCoin (id: string) {
    setSavedCoins(prev => {
      const newVal = {...prev, [id]: prev[id] ? false : true }
      localStorage.setItem("savedCoins", JSON.stringify(newVal));
      return newVal;
    });
  }

  return (
    <PortfolioContext.Provider value={{savedCoins, toggleSavedCoin}}>
      {children}
    </PortfolioContext.Provider>
  );
}
