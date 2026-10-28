import { useQuery } from "@tanstack/react-query";
import { coinsService } from "@/services/CoinsService";
// import type { Coin } from "@/models/coin.model";
import type { Filters } from "@/models/filters.model";
import type { Pagination } from "@/models/pagination.model";

// customHooks lặp và gọi api từg coin - ở component lặp và hiện (để component ko bik về sự hiện diện của coinsService, và m cx ko bik ở component mà vừa lặp vừa gọi api get của từg coin vừa hiện thì làm ntn)

// async function retrieveCoinList () {
//   const coins = await coinsService.getCoinList() as Coin[];

//   coins.map(async coin => {
//     const coinDetails = await coinsService.getCoinDetails(coin.id) as Coin;
//     return {
//       ...coin,
//       price_change_percentage_1h: coinDetails.price_change_percentage_1h,
//       price_change_percentage_7d: coinDetails.price_change_percentage_7d
//     }
//   });

//   return coins;
// }

// async function retrieveCoinList () {
//   const coins = await coinsService.getCoinList() as Coin[];
//   return coins;
// }

export default function useCoins (filters: Filters, pagination: Pagination) {
  return useQuery({
    queryKey: ["coins", filters, pagination],
    queryFn: () => coinsService.getCoinList(filters, pagination),
    // queryFn: retrieveCoinList
    staleTime: 1000 * 60, // đánh dấu trạg thái dlieu 
    refetchInterval: 1000 * 60, // ép react query gọi lại api sau 1 khỏag tgian => đánh dấu vc gọi api
    refetchIntervalInBackground: false,
    enabled: location.pathname === "/"
  });
}