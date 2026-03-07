import axios from "axios";

/**
 * URL base da API backend.
 *
 * Configure no arquivo .env na raiz do projeto:
 *   EXPO_PUBLIC_API_URL=http://SEU_IP:5196
 *
 * ⚠️  Não use "localhost" — emuladores e dispositivos físicos
 *     não conseguem resolver o localhost do seu computador.
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

export default api;
