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
});
