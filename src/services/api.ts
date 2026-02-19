import axios from "axios";

const BASE_URL = "http://localhost:5196";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
