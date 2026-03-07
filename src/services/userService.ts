import api from "./api";
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: string;
  createdAt: string;
  updatedAt?: string;
}

export const userService = {
  async getMe(): Promise<UserProfile> {
    const res = await api.get("/api/Users/me");
    return res.data.data;
  },

  async getById(id: string) {
    const response = await api.get(`/api/Users/${id}`);
    return response.data;
  },

  async updateName(name: string): Promise<UserProfile> {
    const res = await api.put("/api/Users/me", { name });
    return res.data.data;
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
