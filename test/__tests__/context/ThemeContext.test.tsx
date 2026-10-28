// test/__tests__/context/ThemeContext.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/context/theme/ThemeProvider";
import useThemeContext from "@/context/theme/ThemeContext";

function TestConsumer() {
  const { theme, toggleTheme } = useThemeContext();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

function renderWithTheme() {
  return render(
    // dùg context provider bọc component sẽ dùg data của context đó
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("default theme is 'light' when localStorage is empty", () => {
    renderWithTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("context has data when localStorage has dat", () => {
    localStorage.setItem("theme", "dark");
    renderWithTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggleTheme changes from light to dark", () => {
    renderWithTheme();
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("toggleTheme changes from dark to light", () => {
    localStorage.setItem("theme", "dark");
    renderWithTheme();
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  // it("toggleTheme thêm class 'dark' vào <html> khi dark", () => {
  //   renderWithTheme();
  //   fireEvent.click(screen.getByText("Toggle"));
  //   expect(document.documentElement.classList.contains("dark")).toBe(true);
  // });

  // it("toggleTheme xóa class 'dark' khỏi <html> khi light", () => {
  //   localStorage.setItem("theme", "dark");
  //   renderWithTheme();
  //   fireEvent.click(screen.getByText("Toggle"));
  //   expect(document.documentElement.classList.contains("dark")).toBe(false);
  // });

  // it("lưu theme vào localStorage sau khi toggle", () => {
  //   renderWithTheme();
  //   fireEvent.click(screen.getByText("Toggle")); // light → dark
  //   expect(localStorage.getItem("theme")).toBe("dark");
  // });

  // Test cases để tự viết:
  // it("TODO: toggle 2 lần → trở về light", () => {});
});