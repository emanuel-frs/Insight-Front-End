import api from "./api";

export const insightViewService = {
  async recordView(
    insightId: string,
    readingTimeSeconds: number = 0,
  ): Promise<void> {
    try {
      await api.post("/api/InsightViews/view", {
        insightId,
        readingTimeSeconds,
      });
    } catch (e) {
      console.warn("[InsightView] Falha ao registrar view:", e);
    }
  },
};
