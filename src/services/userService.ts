import api from "./api";

export const userService = {
  async getMe() {
    const response = await api.get("/api/Users/me");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/api/Users/${id}`);
    return response.data;
  },

  async updateMe(data: { name?: string; email?: string }) {
    const response = await api.put("/api/Users/me", data);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.put("/api/Users/me/password", data);
    return response.data;
  },
};
