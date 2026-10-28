import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "@/context/theme/ThemeProvider";
import PortfolioProvider from "@/context/portfolio/PortfolioProvider";
import Dashboard from "@/pages/Dashboard";
import type { Category, Coin } from "@/models/coin.model";

vi.mock("@/customHooks/useCoins");
import useCoins from "@/customHooks/useCoins";
vi.mock("@/customHooks/useCategories");
import useCategories from "@/customHooks/useCategories";

const mockCoins: Coin[] = [
  {
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
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://example.com/eth.png",
    current_price: 3000,
    market_cap: 360000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    price_change_percentage_24h: 1.5,
    price_change_percentage_1h_in_currency: 0.3,
    price_change_percentage_7d_in_currency: 2.1,
    sparkline_in_7d: { price: [2900, 2950, 3000] },
  },
];

const mockCategories: Category[] = [
  {
    category_id: "abc",
    name: "abc"
  }
]

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PortfolioProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </PortfolioProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };
}

function renderDashboard() {
  const Wrapper = createWrapper();
  return render(<Dashboard />, { wrapper: Wrapper });
}

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(useCoins).mockReturnValue({
      data: mockCoins,
      isLoading: false,
      error: null,
      isSuccess: true,
      isError: false,
    } as ReturnType<typeof useCoins>);
    vi.mocked(useCategories).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
      isSuccess: true,
      isError: false,
    } as ReturnType<typeof useCategories>);
  });

  afterEach(() => vi.clearAllMocks());

  describe("Loading state", () => {
    it("don't show any data when loading", () => {
      vi.mocked(useCoins).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      } as ReturnType<typeof useCoins>);

      renderDashboard();
      expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("show error when API fails", () => {
      vi.mocked(useCoins).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Network Error"),
        isSuccess: false,
        isError: true,
      } as ReturnType<typeof useCoins>);

      renderDashboard();
      expect(screen.getByText(/Error fetching coins/i)).toBeInTheDocument();
    });
  });

  describe("Data display", () => {
    it("show 2 coins in table", () => {
      renderDashboard();
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();

      expect(screen.getByText("$81,593")).toBeInTheDocument();
      expect(screen.getByText("$3,000")).toBeInTheDocument();
    });

    it("show 'No coin left at this page' when data is empty", () => {
      vi.mocked(useCoins).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
      } as ReturnType<typeof useCoins>);

      renderDashboard();
      expect(screen.getByText(/No coin left/i)).toBeInTheDocument();
    });
  });

  describe("Dark mode toggle", () => {

    it("click checkbox to change theme", () => {
      renderDashboard();
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe("Favorite coin toggle", () => {
    it("click on star to save and unsave coin", async () => {
      renderDashboard();
      const starIcons = document.querySelectorAll("svg.cursor-pointer");

      fireEvent.click(starIcons[0]);
      fireEvent.click(starIcons[1]);

      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem("savedCoins") ?? "{}");
        expect(saved["bitcoin"]).toBe(true);
        expect(saved["ethereum"]).toBe(true);

        expect(starIcons[0]).toHaveClass("fill-current");
        expect(starIcons[1]).toHaveClass("fill-current");
      });

      fireEvent.click(starIcons[0]);

      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem("savedCoins") ?? "{}");
        expect(saved["bitcoin"]).toBe(false);
        expect(saved["ethereum"]).toBe(true);

        expect(starIcons[0]).toHaveClass("fill-none");
        expect(starIcons[1]).toHaveClass("fill-current");
      });
    });
  })

  describe("Table headers", () => {
    it("show header correctly", () => {
      renderDashboard();
      expect(screen.getByText("#")).toBeInTheDocument();
      expect(screen.getByText("coin")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("1h")).toBeInTheDocument();
      expect(screen.getByText("24h")).toBeInTheDocument();
      expect(screen.getByText("7d")).toBeInTheDocument();
      expect(screen.getByText(/total volume/)).toBeInTheDocument();
      expect(screen.getByText(/market cap/)).toBeInTheDocument();
      expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
    });
  });

  describe("PaginationBar", () => {
    it("show PaginationBar when data is loaded", () => {
      renderDashboard();
      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    });

    it("don't show PaginationBar when data is loading", () => {
      vi.mocked(useCoins).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      } as ReturnType<typeof useCoins>);

      renderDashboard();
      expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
    });
  });

  describe("Countdown timer and auto-refresh", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows initial countdown at 60s and decrements each second", () => {
      renderDashboard();
      expect(screen.getByText(/Auto refresh in:/i)).toBeInTheDocument();
      expect(screen.getByText("60s")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText("59s")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(9000);
      });
      expect(screen.getByText("50s")).toBeInTheDocument();

      // resets countdown back to 60s when timer reaches 0
      act(() => {
        vi.advanceTimersByTime(50000);
      });
      expect(screen.getByText("60s")).toBeInTheDocument();
    });

    it("resets countdown to 60s when clicking 'Get latest data immediately!'", () => {
      renderDashboard();
      act(() => {
        vi.advanceTimersByTime(15000);
      });
      expect(screen.getByText("45s")).toBeInTheDocument();

      const refreshBtn = screen.getByRole("button", { name: /Get latest data immediately/i });
      fireEvent.click(refreshBtn);

      expect(screen.getByText("60s")).toBeInTheDocument();
    });
  });
});
