import api from "./api";

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post("/api/Auth/register", data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post("/api/Auth/login", data);
    return response.data;
  },
};
