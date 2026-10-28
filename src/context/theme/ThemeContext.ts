import { createContext, use } from "react";

interface ThemeContext {
  theme: "light" | "dark",
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContext | null>(null);

export default function useThemeContext() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used by a component inside ThemeProvider!");
  return ctx;
}