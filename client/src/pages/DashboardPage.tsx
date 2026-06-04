import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getMyStatsService } from "@/services/complaintService";
import { getAdminStatsService } from "@/services/statsService";
import type { UserStats, AdminStats } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

import { DASHBOARD_STRINGS } from "@/lib/constants/dashboard";
import { MasyarakatStats, AdminStatsView } from "@/components/dashboard/DashboardStats";

/**
 * Main dashboard page displaying user or admin statistics.
 * Fetches and presents relevant dashboard data based on user type.
 */
export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [stats, setStats] = useState<UserStats | AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || !user) {
      if (!isAuthLoading) setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user.userType === "masyarakat") {
          const data = await getMyStatsService();
          setStats(data);
        } else if (user.userType === "petugas" && user.level === "admin") {
          const data = await getAdminStatsService();
          setStats(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : DASHBOARD_STRINGS.ERROR_FETCH_STATS
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (
      user.userType === "masyarakat" ||
      (user.userType === "petugas" && user.level === "admin")
    ) {
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  const renderGreeting = () => (
    <div>
      <h1 className="text-xl md:text-2xl font-bold">
        {DASHBOARD_STRINGS.GREETING_WELCOME}{" "}
        {user?.userType === "masyarakat"
          ? user.nama
          : user?.nama_petugas || DASHBOARD_STRINGS.GREETING_DEFAULT_USER}
        !
      </h1>
      <p className="mt-1 text-muted-foreground">
        {DASHBOARD_STRINGS.GREETING_SUMMARY}
      </p>
    </div>
  );

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {renderGreeting()}
      {error && (
        <div className="p-4 text-center bg-destructive/10 rounded-lg text-sm text-destructive flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {stats &&
        user?.userType === "masyarakat" &&
        <MasyarakatStats data={stats as UserStats} />}
        
      {stats &&
        user?.userType === "petugas" &&
        user.level === "admin" &&
        <AdminStatsView data={stats as AdminStats} />}

      {user?.userType === "petugas" && user.level === "petugas" && (
        <p className="text-muted-foreground pt-4">
          {DASHBOARD_STRINGS.PETUGAS_INSTRUCTION}
        </p>
      )}
    </div>
  );
}

