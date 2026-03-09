import axios, { AxiosError } from "axios";

/**
 * URL base da API backend.
 *
 * Configure no arquivo .env na raiz do projeto:
 *   EXPO_PUBLIC_API_URL=http://SEU_IP:5196
 *
 * Android emulator → http://10.0.2.2:5196
 * Dispositivo físico → http://192.168.x.x:5196  (IP local da sua máquina)
 * Produção → https://sua-api.com
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:5196";

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      const networkError = new Error("NETWORK_ERROR");
      networkError.name = "NETWORK_ERROR";
      return Promise.reject(networkError);
    }
    return Promise.reject(error);
  },
);

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && error.name === "NETWORK_ERROR";
}

export default api;
