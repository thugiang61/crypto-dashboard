import type { AxiosInstance } from "axios";
import HttpService from "@/services/HttpService";
import { httpClient } from "@/services/httpClient";
import type { Filters } from "@/models/filters.model";
import type { Pagination } from "@/models/pagination.model";

const COINS_ENDPOINT = "/coins";

class CoinsService extends HttpService {
  constructor(client: AxiosInstance) {
    super(client);
  }

  // getCoinList () {
  //   return this.get(COINS_ENDPOINT + "/markets?vs_currency=usd");
  // }

  // https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=1h,7d&precision=2
  getCoinList (filters: Filters, pagination: Pagination) {
    // console.log(filters, pagination)
    return this.get(
      COINS_ENDPOINT + 
      "/markets?vs_currency=usd&sparkline=true&price_change_percentage=1h,7d&precision=2" +
      `&per_page=${pagination.numOfRows}&page=${pagination.currentPage}` +
      `${filters.category === "" ? "" : `&category=${filters.category}`}` +
      `&order=${filters.sortOption.includes("#_asc") ? "market_cap_asc" : filters.sortOption.includes("#_desc") ? "market_cap_desc" : filters.sortOption}`
    );
  }

  // getCoinDetails (id: string) {
  //   return this.get(COINS_ENDPOINT + `/${id}`);
  // }
  
  getCategoryList() {
    return this.get(COINS_ENDPOINT + "/categories/list");
  }

  getAllCoins() {
    return this.get(COINS_ENDPOINT + "/list");
  }
}

export const coinsService = new CoinsService(httpClient);