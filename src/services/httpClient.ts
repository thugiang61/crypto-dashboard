import axios from "axios";

export const httpClient = axios.create({
  // Dùng đường dẫn tương đối → đi qua Vite proxy → tránh CORS hoàn toàn
  // Vite proxy: /api/* → https://api.coingecko.com/api/*
  baseURL: "/api/v3",
  headers: {
    "Content-Type": "application/json"
  }
});