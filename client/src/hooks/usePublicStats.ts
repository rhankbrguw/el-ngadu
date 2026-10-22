import { useEffect, useState } from "react";
import api from "@/lib/api";

export interface StatsData {
  total: number;
  proses: number;
  selesai: number;
}

export function usePublicStats() {
  const [stats, setStats] = useState<StatsData>({ total: 0, proses: 0, selesai: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        if (response.data?.data) {
          setStats(response.data.data);
        } else if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        void error;
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}
