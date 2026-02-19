import { useEffect, useState } from "react";
import { insightService } from "../services/insightService";

interface Insight {
  id: string;
  title: string;
  content: string;
  readingTimeMinutes: number;
  insightType: string;
  createdAt: string;
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await insightService.getAll();
        setInsights(response.data ?? []);
      } catch {
        setError("Não foi possível carregar os insights.");
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  return { insights, isLoading, error };
}
