import { useQuery } from "@tanstack/react-query";
import { coinsService } from "@/services/CoinsService";

export default function useCategories () {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => coinsService.getCategoryList()
  });
}