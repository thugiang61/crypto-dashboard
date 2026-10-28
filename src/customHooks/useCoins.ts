import { useQuery } from "@tanstack/react-query";
import { coinsService } from "@/services/CoinsService";
import type { Filters } from "@/models/filters.model";
import type { Pagination } from "@/models/pagination.model";
import { useLocation } from "react-router";

export default function useCoins (filters: Filters, pagination: Pagination) {
  const location = useLocation();

  return useQuery({
    queryKey: ["coins", filters, pagination],
    queryFn: () => coinsService.getCoinList(filters, pagination),
    staleTime: 1000 * 60,
    enabled: location.pathname === "/"
  });
}
