import api from "./api";

export interface FavoriteInsight {
  id: string;
  userId: string;
  insightId: string;
  insight: {
    id: string;
    title: string;
    content: string;
    readingTimeMinutes: number;
    insightType: string;
    createdAt: string;
  } | null;
  createdAt: string;
}

export const favoriteService = {
  async getAll(): Promise<FavoriteInsight[]> {
    const res = await api.get("/api/Favorites");
    return res.data.data ?? [];
  },

  async add(insightId: string): Promise<void> {
    await api.post("/api/Favorites", { insightId });
  },

  async remove(insightId: string): Promise<void> {
    await api.delete(`/api/Favorites/${insightId}`);
  },
};
