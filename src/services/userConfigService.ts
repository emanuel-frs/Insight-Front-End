import api from "./api";

export const userConfigService = {
  async getMyConfig() {
    const response = await api.get("/api/UserConfigs");
    return response.data;
  },

  async create(data: any) {
    const response = await api.post("/api/UserConfigs", data);
    return response.data;
  },

  async update(data: any) {
    const response = await api.put("/api/UserConfigs", data);
    return response.data;
  },
};
