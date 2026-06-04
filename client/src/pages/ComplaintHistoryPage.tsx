import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyPengaduanService } from "@/services/complaintService";
import { Skeleton } from "@/components/ui/skeleton";
import type { Pengaduan, Pagination } from "@/types";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, History } from "lucide-react";
import { HistoryTable } from "@/components/history/HistoryTable";
import { HistoryCards } from "@/components/history/HistoryCards";
import DataTablePagination from "@/components/common/DataTablePagination";

export default function ComplaintHistoryPage() {
 const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
 const [pagination, setPagination] = useState<Pagination | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [currentPage, setCurrentPage] = useState(1);

 const fetchPengaduan = useCallback(async (page: number) => {
 setIsLoading(true);
 setError(null);
 try {
 const response = await getMyPengaduanService(page, 10);
 setPengaduan(response.data);
 setPagination(response.pagination);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Gagal memuat data.");
 } finally {
 setIsLoading(false);
 }
 }, []);

 useEffect(() => {
 fetchPengaduan(currentPage);
 }, [fetchPengaduan, currentPage]);

 const renderContent = () => {
 if (isLoading) {
 return (
 <div className="space-y-4 mt-6">
 <Skeleton className="h-40 w-full" />
 <Skeleton className="h-40 w-full" />
 <Skeleton className="h-40 w-full" />
 </div>
 );
 }
 
 if (error) {
 return (
 <div className="flex flex-col h-40 items-center justify-center space-y-3 text-center">
 <AlertCircle className="h-8 w-8 text-destructive" />
 <div className="space-y-1">
 <p className="font-semibold text-destructive">Gagal Memuat Data</p>
 <p className="text-sm text-muted-foreground">{error}</p>
 </div>
 <Button variant="outline" size="sm" onClick={() => fetchPengaduan(currentPage)}>
 Coba Lagi
 </Button>
 </div>
 );
 }

 if (!pengaduan || pengaduan.length === 0) {
 return (
 <div className="flex flex-col h-40 items-center justify-center space-y-3 text-center">
 <FileText className="h-8 w-8 text-muted-foreground" />
 <p className="font-medium text-muted-foreground">
 Anda belum membuat pengaduan apapun.
 </p>
 </div>
 );
 }

 return (
 <div className="space-y-4">
 <div className="hidden md:block">
 <HistoryTable riwayatList={pengaduan} />
 </div>
 <div className="block md:hidden">
 <HistoryCards riwayatList={pengaduan} />
 </div>
 {pagination && pagination.total_pages > 1 && (
 <DataTablePagination
 pagination={pagination}
 onPageChange={setCurrentPage}
 />
 )}
 </div>
 );
 };

 return (
 <div className="space-y-4 md:space-y-6 p-4 sm:p-6 lg:p-8">
 <div className="flex items-center gap-4 mb-4">
 <History className="h-7 w-7 text-primary" />
 <div className="space-y-1">
 <h1 className="text-xl sm:text-2xl font-bold tracking-tight">History Pengaduan</h1>
 <p className="text-sm sm:text-base text-muted-foreground">
 Kelola dan pantau semua pengaduan yang pernah Anda buat.
 </p>
 </div>
 </div>

 <Card>
 <CardHeader>
 <div className="flex flex-col gap-y-3 md:flex-row md:items-center md:justify-between">
 <div>
 <CardTitle>Daftar Pengaduan Saya</CardTitle>
 <CardDescription>
 {pagination
 ? `${pagination.total_records} pengaduan ditemukan.`
 : "Memuat..."}
 </CardDescription>
 </div>
 <Button asChild size="sm" className="w-full md:w-auto">
 <Link to="/dashboard/create-complaint">
 <FileText className="w-4 h-4 mr-2" />
 Buat Pengaduan Baru
 </Link>
 </Button>
 </div>
 </CardHeader>
 <CardContent>{renderContent()}</CardContent>
 </Card>
 </div>
 );
}
