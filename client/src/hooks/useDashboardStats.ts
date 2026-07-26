import { useState, useEffect } from "react";
import type { UserStats, AdminStats, User } from "@/types";
import { getMyStatsService } from "@/services/complaintService";
import { getAdminStatsService } from "@/services/statsService";

export function useDashboardStats(user: User | null) {
  const [stats, setStats] = useState<UserStats | AdminStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsStatsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsStatsLoading(true);
      setStatsError(null);
      try {
        if (user.userType === "masyarakat") {
          const data = await getMyStatsService();
          setStats(data);
        } else if (user.userType === "petugas") {
          const data = await getAdminStatsService();
          setStats(data);
        }
      } catch (err) {
        setStatsError(
          err instanceof Error ? err.message : "Gagal memuat data statistik."
        );
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, isStatsLoading, statsError };
}
