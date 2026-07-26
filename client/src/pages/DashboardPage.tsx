import { useDashboard } from "@/hooks/useDashboard";
import type { UserStats, AdminStats } from "@/types";
import { AlertCircle } from "lucide-react";

import { DASHBOARD_STRINGS } from "@/lib/constants/dashboard";
import { MasyarakatStats, AdminStatsView } from "@/components/dashboard/DashboardStats";

import { QuickActions } from "@/components/dashboard/QuickActions";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Main dashboard page displaying user or admin statistics.
 * Fetches and presents relevant dashboard data based on user type.
 */
export default function DashboardPage() {
  const { user, stats, isStatsLoading, statsError } = useDashboard();
  const isLoading = isStatsLoading;
  const error = statsError;
  const isAuthLoading = !user && isLoading;

 const renderGreeting = () => (
 <div>
 <h1 className="text-xl md:text-2xl font-bold">
 {DASHBOARD_STRINGS.GREETING_WELCOME}{" "}
 {user?.userType === "masyarakat"
 ? user.nama
 : user?.nama_petugas || DASHBOARD_STRINGS.GREETING_DEFAULT_USER}
 !
 </h1>
 <p className="mt-1 text-sm sm:text-base text-muted-foreground">
 {DASHBOARD_STRINGS.GREETING_SUMMARY}
 </p>
 </div>
 );

 if (isAuthLoading || isLoading) {
 return (
 <div className="space-y-4 sm:space-y-6">
 <div>
 <Skeleton className="h-8 w-3/4 sm:w-64" />
 <Skeleton className="mt-2 h-4 w-full sm:w-96" />
 </div>
 <Skeleton className="h-32 w-full" />
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <Skeleton className="h-24" />
 <Skeleton className="h-24" />
 <Skeleton className="h-24" />
 <Skeleton className="h-24" />
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-4 sm:space-y-6">
 {renderGreeting()}
 {error && (
 <div className="p-4 text-center bg-destructive/10 rounded-lg text-sm text-destructive flex items-center justify-center gap-2">
 <AlertCircle className="h-4 w-4" />
 {error}
 </div>
 )}

 {user && <QuickActions user={user} />}

 {stats && user?.userType === "masyarakat" && (
 <MasyarakatStats data={stats as UserStats} />
 )}

 {stats && user?.userType === "petugas" && (
 <AdminStatsView data={stats as AdminStats} />
 )}

 {user?.userType === "petugas" && user.level === "petugas" && (
 <p className="text-sm sm:text-base text-muted-foreground pt-2 text-center">
 {DASHBOARD_STRINGS.PETUGAS_INSTRUCTION}
 </p>
 )}
 </div>
 );
}
