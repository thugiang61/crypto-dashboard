import axios from "axios";

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

export const httpClient = axios.create({
  // Dùng đường dẫn tương đối → đi qua Vite proxy → tránh CORS hoàn toàn
  // Vite proxy: /api/* → https://api.coingecko.com/api/*
  // Khi ở môi trường Dev có thể dùng proxy, nhưng trên Production gọi trực tiếp CoinGecko
  baseURL: import.meta.env.PROD
    ? "https://api.coingecko.com/api/v3"
    : "/api/v3",
  headers: {
    "Content-Type": "application/json",
    // Nếu có Demo API key từ CoinGecko thì gửi qua header
    ...(API_KEY ? { "x-cg-demo-api-key": API_KEY } : {})
  }
});
