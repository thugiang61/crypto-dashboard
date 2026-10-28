import { useEffect, useState, type ReactElement } from "react";
import { ThemeContext } from "@/context/theme/ThemeContext";

// file context là để tạo context và quy định nhữg ttin của context và tạo custom hook để component con 
// có thể get ttin của context ra cho gọn, còn provider là component dùg để bọc ngoài các component khác 
// cx như đnghia state và hàm xli để truyền vào value của context.provider 
// => tạo context -> truyền các ttin vào value của context.provider -> component children get các ttin này ra để dùg 
// (search "có nên tách thành context.ts và provider.tsx ở react không" thì bảo ko nhưg cần tách 2 file ra để có thể epxort component riêg vs nhữg hàm logic thì hot reload ms hdong đc)

interface ThemeProviderProps {
  children: ReactElement
}

export function ThemeProvider ({children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // return localStorage.getItem("theme") as ("light" | "dark") ?? "light";
    return localStorage.getItem("theme") as ("light" | "dark") || "light";
  });
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  // search "cách đổi màu ở dark light mode trong react, tailwind, theme context"
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