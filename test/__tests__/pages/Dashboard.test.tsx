// test/__tests__/pages/Dashboard.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "@/context/theme/ThemeProvider";
import PortfolioProvider from "@/context/portfolio/PortfolioProvider";
import Dashboard from "@/pages/Dashboard";
import type { Category, Coin } from "@/models/coin.model";

// Mock useCoins để không gọi API thật
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

// Helper tạo wrapper đầy đủ providers cho Dashboard
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
  return render(<Dashboard />, { wrapper: Wrapper }); // wrapper của component Dashboard
}

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    // Default mock: data loaded thành công
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
      // Skeleton rows có class animate (từ CoinSkeleton emotion)
      // Không hiện tên coin
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
      // 2 coins mock → 2 hàng
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
      
      expect(screen.getByText("$81,593")).toBeInTheDocument();
      expect(screen.getByText("$3,000")).toBeInTheDocument();
    });

    // it("hiện giá đúng cho từng coin", () => {
    //   renderDashboard();
    //   expect(screen.getByText("$81,593")).toBeInTheDocument();
    //   expect(screen.getByText("$3,000")).toBeInTheDocument();
    // });

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
    // it("checkbox dark mode tồn tại", () => {
    //   renderDashboard();
    //   const checkbox = screen.getByRole("checkbox");
    //   expect(checkbox).toBeInTheDocument();
    // });

    it("click checkbox to change theme", () => {
      renderDashboard();
      const checkbox = screen.getByRole("checkbox");
      
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked(); // light mode mặc định

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked(); // dark mode sau khi click
    });
  });

  describe("Favorite coin toggle", () => {
    // it("click on Bitcoin star to save Bitcoin", async () => {
    //   renderDashboard();

    //   // Tìm tất cả SVG star — lấy cái đầu tiên (Bitcoin = row đầu)
    //   const starIcons = document.querySelectorAll("svg.cursor-pointer");
    //   const bitcoinStar = starIcons[0];

    //   // Ban đầu chưa save → fill-none
    //   expect(bitcoinStar).toHaveClass("fill-none");

    //   // Click để save
    //   fireEvent.click(bitcoinStar);
    //   // Sau click: PortfolioProvider cập nhật state → re-render → fill-current
    //   await waitFor(() => {
    //     const saved = JSON.parse(localStorage.getItem("savedCoins") ?? "{}");
    //     expect(saved["bitcoin"]).toBe(true);
    //     expect(bitcoinStar).toHaveClass("fill-current");
    //   });
    // });
    
    it("click on star to save and unsave coin", async () => {
      renderDashboard();
      const starIcons = document.querySelectorAll("svg.cursor-pointer");

      fireEvent.click(starIcons[0]); // save Bitcoin
      fireEvent.click(starIcons[1]); // save Ethereum

      await waitFor(() => {  
        const saved = JSON.parse(localStorage.getItem("savedCoins") ?? "{}");
        expect(saved["bitcoin"]).toBe(true);
        expect(saved["ethereum"]).toBe(true);

        expect(starIcons[0]).toHaveClass("fill-current");
        expect(starIcons[1]).toHaveClass("fill-current");
      });
      // await waitFor(() => expect(starIcons[1]).toHaveClass("fill-current"));

      fireEvent.click(starIcons[0]); // unsave Bitcoin

      await waitFor(() => {  
        const saved = JSON.parse(localStorage.getItem("savedCoins") ?? "{}");
        expect(saved["bitcoin"]).toBe(false);
        expect(saved["ethereum"]).toBe(true);

        expect(starIcons[0]).toHaveClass("fill-none");   // Bitcoin: unsaved
        expect(starIcons[1]).toHaveClass("fill-current"); // Ethereum: vẫn saved
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
      // Vì capitalize là CSS, không thay đổi nội dung chữ trong DOM. Trong SortField.tsx, class này chỉ làm trình duyệt hiển thị chữ cái đầu mỗi từ viết hoa; nội dung JSX vẫn là total volume. Testing Library tìm nội dung trong DOM, không tìm chữ sau khi CSS biến đổi
      expect(screen.getByText(/total volume/)).toBeInTheDocument();
      expect(screen.getByText(/market cap/)).toBeInTheDocument();
      expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
    });
  });

  describe("PaginationBar", () => {
    it("show PaginationBar when data is loaded", () => {
      renderDashboard();
      // PaginationBar luôn hiện "Showing X to Y"
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

  // TODO test cases để tự viết:
  // it("TODO: click SortField '#' → useCoins được gọi lại với sortOption mới", () => {});
  // it("TODO: click nút ► → useCoins được gọi với page + 1", () => {});
  // it("TODO: đổi select Rows → useCoins gọi với numOfRows mới và page=1", () => {});
  // it("TODO: click star của Bitcoin → Bitcoin xuất hiện trong savedCoins", () => {});
});