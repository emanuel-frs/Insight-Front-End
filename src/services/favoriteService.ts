import api from "./api";

export const favoriteService = {
  async getMyFavorites() {
    const response = await api.get("/api/Favorites");
    return response.data;
  },

  async add(insightId: string) {
    const response = await api.post("/api/Favorites", {
      insightId,
    });
    return response.data;
  },

  async remove(insightId: string) {
    const response = await api.delete(`/api/Favorites/${insightId}`);
    return response.data;
  },
};
