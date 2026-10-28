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
    // queryFn: retrieveCoinList
    staleTime: 1000 * 60, // đánh dấu trạg thái dlieu 
    // refetchInterval: 1000 * 60, // ép react query gọi lại api sau 1 khỏag tgian => đánh dấu vc gọi api
    // refetchIntervalInBackground: false,
    enabled: location.pathname === "/"
  });
}
