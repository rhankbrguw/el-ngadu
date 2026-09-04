import { StatCard } from "./StatCard";
import { FileText, History, CheckCircle, Users, ShieldCheck } from "lucide-react";
import type { UserStats, AdminStats } from "@/types";
import { DASHBOARD_STRINGS } from "@/lib/constants/dashboard";

/**
 * Renders the dashboard statistics for a regular user (masyarakat).
 *
 * @param props - An object containing the user's statistics data.
 * @returns A grid layout of user statistics cards.
 */
export const MasyarakatStats = ({ data }: { data: UserStats }) => (
 <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
 <StatCard
 title={DASHBOARD_STRINGS.STATS_MASYARAKAT.TOTAL_DIAJUKAN}
 value={data.diajukan}
 icon={<FileText className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/history"
 />
 <StatCard
 title={DASHBOARD_STRINGS.STATS_MASYARAKAT.SEDANG_DIPROSES}
 value={data.diproses}
 icon={<History className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/history"
 />
 <StatCard
 title={DASHBOARD_STRINGS.STATS_MASYARAKAT.LAPORAN_SELESAI}
 value={data.selesai}
 icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/history"
 />
 </div>
);

/**
 * Renders the dashboard statistics for an admin user.
 *
 * @param props - An object containing the admin's statistics data.
 * @returns A grid layout of admin statistics cards.
 */
export const AdminStatsView = ({ data }: { data: AdminStats }) => (
 <div className="space-y-4 sm:space-y-6">
 <div className="grid gap-3 md:grid-cols-3">
 <StatCard
 title={DASHBOARD_STRINGS.STATS_ADMIN.PENGADUAN_DIAJUKAN}
 value={data.pengaduan_diajukan}
 icon={<FileText className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/manage-complaints"
 />
 <StatCard
 title={DASHBOARD_STRINGS.STATS_ADMIN.PENGADUAN_DIPROSES}
 value={data.pengaduan_diproses}
 icon={<History className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/manage-complaints"
 />
 <StatCard
 title={DASHBOARD_STRINGS.STATS_ADMIN.PENGADUAN_SELESAI}
 value={data.pengaduan_selesai}
 icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/manage-complaints"
 />
 </div>
 <div className="grid gap-3 md:grid-cols-2">
 <StatCard
 title={DASHBOARD_STRINGS.STATS_ADMIN.TOTAL_MASYARAKAT}
 value={data.total_masyarakat}
 icon={<Users className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/manage-citizens"
 />
 <StatCard
 title={DASHBOARD_STRINGS.STATS_ADMIN.TOTAL_PETUGAS}
 value={data.total_petugas}
 icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
 href="/dashboard/manage-officers"
 />
 </div>
 </div>
);
