import { useCallback, useEffect, useState } from "react";
import api, { isNetworkError } from "../services/api";

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

async function fetchInsights(types: number[], excludeViewed: boolean) {
  const typeParams =
    types.length > 0
      ? types.map((t) => `types=${INSIGHT_TYPE_STR[t]}`).join("&")
      : "";
  const excludeParam = excludeViewed ? "excludeViewed=true" : "";
  const queryParts = [typeParams, excludeParam].filter(Boolean);
  const query = queryParts.length > 0 ? "?" + queryParts.join("&") : "";
  const res = await api.get(`/api/Insights${query}`);
  return res.data.data ?? [];
}

export function useInsights(interestedTypes?: number[]) {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const load = useCallback(async () => {
    if (interestedTypes === undefined) return;
    setIsLoading(true);
    setNetworkError(false);
    try {
      let data = await fetchInsights(interestedTypes, true);
      if (data.length === 0) {
        data = await fetchInsights(interestedTypes, false);
      }
      setInsights(shuffleArray(data));
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      } else {
        console.error("[useInsights] Erro ao buscar insights:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(interestedTypes)]);

  useEffect(() => {
    load();
  }, [load]);

  return { insights, isLoading, networkError, reload: load };
}
