
export interface Coin {
  id: string,
  market_cap_rank: number,
  image: string,
  name: string,
  symbol: string,
  current_price: number,
  price_change_percentage_1h_in_currency: number,
  price_change_percentage_24h: number,
  price_change_percentage_7d_in_currency: number,
  total_volume: number,
  market_cap: number,
  sparkline_in_7d: {
    price: number[]
  }
}

export interface Category {
  category_id: string,
  name: string
}
