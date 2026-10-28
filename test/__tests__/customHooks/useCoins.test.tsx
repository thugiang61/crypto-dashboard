import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCoins from "@/customHooks/useCoins";
import { coinsService } from "@/services/CoinsService";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";

const mockCoin = { id: "bitcoin", name: "Bitcoin" };

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

afterEach(() => vi.restoreAllMocks());

describe("useCoins", () => {
  it("return data from coinsService when fetching successfully", async () => {
    vi.spyOn(coinsService, "getCoinList").mockResolvedValueOnce([mockCoin]);

    const { result } = renderHook(
      () => useCoins({ sortOption: "#_desc", category: "" }, { currentPage: 1, numOfRows: 100 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([mockCoin]);
    expect(result.current.error).toEqual(null);
  });

  it("return error when fetching unsuccessfully", async () => {
    vi.spyOn(coinsService, "getCoinList").mockRejectedValueOnce("Error");

    const { result } = renderHook(
      () => useCoins({ sortOption: "#_desc", category: "" }, { currentPage: 1, numOfRows: 100 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual(undefined);
    expect(result.current.error).toEqual("Error");
  })

  it("isLoading initial value is true", () => {
    vi.spyOn(coinsService, "getCoinList").mockResolvedValueOnce([]);

    const { result } = renderHook(
      () => useCoins({ sortOption: "#_desc", category: "" }, { currentPage: 1, numOfRows: 100 }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
  });

  it("queryKey changes and query refetches when filters changes", async () => {
    const spy = vi.spyOn(coinsService, "getCoinList").mockResolvedValue([]);

    const { rerender } = renderHook(
      ({ filters }) => useCoins(filters, { currentPage: 1, numOfRows: 100 }),
      {
        wrapper: createWrapper(),
        initialProps: { filters: { sortOption: "#_desc", category: "" } },
      }
    );

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    rerender({ filters: { sortOption: "id_asc", category: "" } });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });

  it("queryKey changes and query refetches when pagination changes", async () => {
    const spy = vi.spyOn(coinsService, "getCoinList").mockResolvedValue([]);

    const { rerender } = renderHook(
      ({ pagination }) => useCoins({ sortOption: "#_desc", category: "" }, pagination),
      {
        wrapper: createWrapper(),
        initialProps: { pagination: { currentPage: 1, numOfRows: 100 } },
      }
    );

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    rerender({ pagination: { currentPage: 2, numOfRows: 100 } });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });
});
