import useCategories from "@/customHooks/useCategories";
import { coinsService } from "@/services/CoinsService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, vi, afterEach, expect } from "vitest";

const mockCategory = { id: "smart_contract_coin", name: "Smart contract coin" };

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

afterEach(() => vi.restoreAllMocks());

describe("useCategories", () => {
  it("return data from API when fetching successfully", async () => {
    vi.spyOn(coinsService, "getCategoryList").mockResolvedValueOnce([mockCategory]);

    const { result } = renderHook(
      () => useCategories(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([mockCategory]);
    expect(result.current.error).toEqual(null);
  })

  it("return error from API when fetching unsuccessfully", async () => {
    vi.spyOn(coinsService, "getCategoryList").mockRejectedValueOnce("Error");

    const { result } = renderHook(
      () => useCategories(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual(undefined);
    expect(result.current.error).toEqual("Error");
  })
})
