import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioProvider from "@/context/portfolio/PortfolioProvider";
import usePortfolioContext from "@/context/portfolio/PortfolioContext";

function TestConsumer() {
  const { savedCoins, toggleSavedCoin } = usePortfolioContext();
  return (
    <div>
      <span data-testid="coin-1">{String(!!savedCoins["1"])}</span>
      <button onClick={() => toggleSavedCoin("1")}>Toggle 1</button>
    </div>
  );
}

describe("PortfolioContext", () => {
  beforeEach(() => localStorage.clear());

  it("context is empty when localStorage is empty", () => {
    render(<PortfolioProvider><TestConsumer /></PortfolioProvider>);
    expect(screen.getByTestId("coin-1")).toHaveTextContent("false");
  });

  it("toggleSavedCoin saves coin to localStorage", () => {
    render(<PortfolioProvider><TestConsumer /></PortfolioProvider>);

    fireEvent.click(screen.getByText("Toggle 1"));

    expect(screen.getByTestId("coin-1")).toHaveTextContent("true");
    expect(JSON.parse(localStorage.getItem("savedCoins")!)[1]).toBe(true);
  });

  it("toggleSavedCoin unsaves a coin", () => {
    render(<PortfolioProvider><TestConsumer /></PortfolioProvider>);
    fireEvent.click(screen.getByText("Toggle 1"));
    fireEvent.click(screen.getByText("Toggle 1"));
    expect(screen.getByTestId("coin-1")).toHaveTextContent("false");
  });

  it("context has data when localStorage has data", () => {
    localStorage.setItem("savedCoins", JSON.stringify({ 1: true }));
    render(<PortfolioProvider><TestConsumer /></PortfolioProvider>);
    expect(screen.getByTestId("coin-1")).toHaveTextContent("true");
  });
});
