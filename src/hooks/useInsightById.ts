import { useEffect, useState } from "react";
import { insightService } from "../services/insightService";

export function useInsightById(id: string) {
  const [insight, setInsight] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await insightService.getById(id);
        setInsight(response.data);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetch();
  }, [id]);

  return { insight, isLoading };
}
