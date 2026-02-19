import api from "./api";

export const insightService = {
  async getAll() {
    const response = await api.get("/api/Insights");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/api/Insights/${id}`);
    return response.data;
  },

  async create(data: { title: string; content: string; type: string }) {
    const response = await api.post("/api/Insights", data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/api/Insights/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/api/Insights/${id}`);
    return response.data;
  },
};
