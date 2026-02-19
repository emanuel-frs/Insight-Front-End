import api from "./api";

export const insightViewService = {
  async recordView(insightId: string) {
    const response = await api.post("/api/InsightViews/view", {
      insightId,
    });
    return response.data;
  },

  async toggleLike(insightId: string) {
    const response = await api.post("/api/InsightViews/like", {
      insightId,
    });
    return response.data;
  },
};
