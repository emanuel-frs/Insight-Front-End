import { useEffect, useState } from "react";
import api from "../services/api";

interface Insight {
  id: string;
  title: string;
  content: string;
  readingTimeMinutes: number;
  insightType: string;
  createdAt: string;
}

const INSIGHT_TYPE_STR: Record<number, string> = {
  0: "Psicologia",
  1: "Financas",
  2: "Saude",
  3: "Tecnologia",
  4: "Carreira",
  5: "Relacionamentos",
  6: "Produtividade",
  7: "Autoconhecimento",
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useInsights(interestedTypes?: number[]) {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (interestedTypes === undefined) return;

    const types = interestedTypes;

    async function load() {
      try {
        const params = types.length
          ? "?" + types.map((t) => `types=${INSIGHT_TYPE_STR[t]}`).join("&")
          : "";
        const res = await api.get(`/api/Insights${params}`);
        setInsights(shuffleArray(res.data.data ?? []));
      } catch (e) {
        console.error("Erro ao buscar insights:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [JSON.stringify(interestedTypes)]);

  return { insights, isLoading };
}
