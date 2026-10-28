import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CoinRow from "@/components/CoinRow";
import { PortfolioContext } from "@/context/portfolio/PortfolioContext";
import type { Coin } from "@/models/coin.model";

const mockCoin: Coin = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://example.com/btc.png",
  current_price: 81593,
  market_cap: 1639947861371,
  market_cap_rank: 1,
  total_volume: 25277241750,
  price_change_percentage_24h: -0.72,
  price_change_percentage_1h_in_currency: 0.10,
  price_change_percentage_7d_in_currency: -1.29,
  sparkline_in_7d: { price: [80000, 81000, 82000] },
};

function renderCoinRow(savedCoins = {}, toggleSavedCoin = vi.fn(), coin = mockCoin) {
  return render(
    <PortfolioContext.Provider value={{ savedCoins, toggleSavedCoin }}>
      <table><tbody>
        <CoinRow coin={coin} />
      </tbody></table>
    </PortfolioContext.Provider>
  );
}

describe("CoinRow", () => {
  it("show coin's information correctly", () => {
    renderCoinRow();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("btc")).toBeInTheDocument();
    expect(screen.getByText("$81,593")).toBeInTheDocument();
    expect(screen.getByText("$25,277,241,750")).toBeInTheDocument();
    expect(screen.getByText("$1,639,947,861,371")).toBeInTheDocument();
  });


  it("1h% positive => show green text and up arrow", () => {
    renderCoinRow();
    const greenSpans = document.querySelectorAll(".text-green-500");
    expect(greenSpans.length).toBeGreaterThan(0);

    expect(screen.getByText("0.1%")).toBeInTheDocument();
    expect(screen.getAllByText("▲").length).toBeGreaterThan(0);
  });

  it("24h% negative => show red text and down arrow", () => {
    renderCoinRow();
    const redSpans = document.querySelectorAll(".text-red-500");
    expect(redSpans.length).toBeGreaterThan(0);

    expect(screen.getByText("0.7%")).toBeInTheDocument();
    expect(screen.getAllByText("▼").length).toBeGreaterThan(0);
  });

  it("click star => call toggleSavedCoin with coin's id", () => {
    const toggleMock = vi.fn();
    renderCoinRow({}, toggleMock);
    fireEvent.click(document.querySelector("svg")!);

    expect(toggleMock).toHaveBeenCalledWith(mockCoin.id);
  });

  it("star SVG fill-current when coin is saved", () => {
    renderCoinRow({ [mockCoin.id]: true });
    expect(document.querySelector("svg")).toHaveClass("fill-current");
  });

  it("star SVG has fill-none when coin isn't saved", () => {
    renderCoinRow({ 1: false });
    expect(document.querySelector("svg")).toHaveClass("fill-none");
  });

  it("show green text when 1h% value is -0.0008 (because it is truncated into 0.0 ≥ 0)", () => {
    renderCoinRow({}, vi.fn(), {...mockCoin, price_change_percentage_1h_in_currency: -0.0008});

    const greenSpans = document.querySelectorAll(".text-green-500");
    expect(greenSpans.length).toBeGreaterThan(0);

    expect(greenSpans[0].textContent).toContain("0.0%");
  });

});
