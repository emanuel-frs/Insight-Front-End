import api from "./api";

export const insightGeneratorService = {
  async generate(data: { insightType: string; quantity: number }) {
    const response = await api.post("/api/InsightGenerator/generate", data);
    return response.data;
  },

  async generateQuick(type: string) {
    const response = await api.post(
      `/api/InsightGenerator/generate/quick?type=${type}`,
    );
    return response.data;
  },
};
