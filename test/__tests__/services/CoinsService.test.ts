import { describe, it, expect, vi, afterEach } from "vitest";
import { coinsService } from "@/services/CoinsService";
import { httpClient } from "@/services/httpClient";

const mockFilters = { sortOption: "#_desc", category: "" };
const mockPagination = { currentPage: 1, numOfRows: 100 };
const mockCoin = { id: "bitcoin", name: "Bitcoin", symbol: "btc" };

afterEach(() => vi.restoreAllMocks());

describe("CoinsService.getCoinList", () => {
  it("call right endpoint with default filters and pagination", async () => {
    const spy = vi.spyOn(httpClient, "get").mockResolvedValueOnce({
      data: [mockCoin],
    });
    await coinsService.getCoinList(mockFilters, mockPagination);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("/coins/markets")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("per_page=100")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("page=1")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("order=market_cap_desc")
    );
  });

  it("map #_asc to market_cap_asc in API", async () => {
    const spy = vi.spyOn(httpClient, "get").mockResolvedValueOnce({ data: [] });
    await coinsService.getCoinList(
      { sortOption: "#_asc", category: "" },
      mockPagination
    );

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("order=market_cap_asc")
    );
  });

  it("add category to endpoint when category is not empty", async () => {
    const spy = vi.spyOn(httpClient, "get").mockResolvedValueOnce({ data: [] });
    await coinsService.getCoinList(
      { sortOption: "#_desc", category: "decentralized-finance-defi" },
      mockPagination
    );

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("category=decentralized-finance-defi")
    );
  });

  it("don't add category to endpoint when category is empty", async () => {
    const spy = vi.spyOn(httpClient, "get").mockResolvedValueOnce({ data: [] });
    await coinsService.getCoinList(mockFilters, mockPagination);

    expect(spy).not.toHaveBeenCalledWith(
      expect.stringContaining("category=")
    );
  });
});
