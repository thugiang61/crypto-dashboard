import type { AxiosInstance } from "axios"

export default class HttpService {
  client: AxiosInstance

  constructor(client: AxiosInstance) {
    this.client = client
  }

  async get (endpoint: string) {
    try {
      const response = await this.client.get(endpoint);
      return response.data;
    } catch(e) {
      console.log("Axios error: ", e);
    }
  }
}
