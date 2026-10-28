import axios from "axios";

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

export const httpClient = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://api.coingecko.com/api/v3"
    : "/api/v3",
  headers: {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-cg-demo-api-key": API_KEY } : {})
  }
});
