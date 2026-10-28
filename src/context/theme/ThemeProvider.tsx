import { useEffect, useState, type ReactElement } from "react";
import { ThemeContext } from "@/context/theme/ThemeContext";

interface ThemeProviderProps {
  children: ReactElement
}

export function ThemeProvider ({children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return localStorage.getItem("theme") as ("light" | "dark") || "light";
  });
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
