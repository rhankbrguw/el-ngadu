import { useState, useEffect } from "react";
import type { UserStats, AdminStats, User } from "@/types";
import { getMyStatsService } from "@/services/complaintService";
import { getAdminStatsService } from "@/services/statsService";

async function loadUserStats(user: User): Promise<UserStats | AdminStats | null> {
  if (user.userType === "masyarakat") return await getMyStatsService();
  if (user.userType === "petugas") return await getAdminStatsService();
  return null;
}

export function useDashboardStats(user: User | null) {
  const [stats, setStats] = useState<UserStats | AdminStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsStatsLoading(false);
      return;
    }
    setIsStatsLoading(true);
    setStatsError(null);
    loadUserStats(user)
      .then((data) => setStats(data))
      .catch((err) => setStatsError(err instanceof Error ? err.message : "Gagal memuat data statistik."))
      .finally(() => setIsStatsLoading(false));
  }, [user]);

  return { stats, isStatsLoading, statsError };
}

