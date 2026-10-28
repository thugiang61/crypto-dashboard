import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api/v3",
  headers: {
    "Content-Type": "application/json"
  }
});
