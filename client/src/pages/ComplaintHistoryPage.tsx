import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaintHistory } from "@/hooks/useComplaintHistory";
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
import { APP_MESSAGES } from "@/lib/constants/messages";


const HistoryHeader = ({ totalRecords }: { totalRecords?: number }) => (
  <div className="flex flex-col gap-y-3 md:flex-row md:items-center md:justify-between">
    <div>
      <CardTitle>{APP_MESSAGES.HISTORY.LIST_TITLE}</CardTitle>
      <CardDescription>{totalRecords !== undefined ? `${totalRecords} pengaduan ditemukan.` : APP_MESSAGES.COMMON.LOADING}</CardDescription>
    </div>
    <Button asChild size="sm" className="w-full md:w-auto">
      <Link to="/dashboard/create-complaint">
        <FileText className="w-4 h-4 mr-2" />
        Buat Pengaduan Baru
      </Link>
    </Button>
  </div>
);

interface HistoryContentProps {
  isLoading: boolean;
  error: string | null;
  pengaduan: ReturnType<typeof useComplaintHistory>["pengaduan"];
  pagination: ReturnType<typeof useComplaintHistory>["pagination"];
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

const HistoryContent = ({ isLoading, error, pengaduan, pagination, onPageChange, onRetry }: HistoryContentProps) => {
  if (isLoading) {
    return <div className="space-y-4 mt-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>;
  }
  if (error) {
    return (
      <div className="flex flex-col h-40 items-center justify-center space-y-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>{APP_MESSAGES.COMMON.RETRY || "Coba Lagi"}</Button>
      </div>
    );
  }
  if (!pengaduan || pengaduan.length === 0) {
    return (
      <div className="flex flex-col h-40 items-center justify-center space-y-3 text-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium text-muted-foreground">{APP_MESSAGES.HISTORY.EMPTY || "Anda belum membuat pengaduan apapun."}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="hidden md:block"><HistoryTable riwayatList={pengaduan} /></div>
      <div className="block md:hidden"><HistoryCards riwayatList={pengaduan} /></div>
      {pagination && pagination.total_pages > 1 && <DataTablePagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
};

export default function ComplaintHistoryPage() {
  const { pengaduan, pagination, isLoading, error, currentPage, setCurrentPage, fetchPengaduan } = useComplaintHistory();

  return (
    <div className="space-y-4 md:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-4">
        <History className="h-7 w-7 text-primary" />
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{APP_MESSAGES.HISTORY.TITLE}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Kelola dan pantau semua pengaduan yang pernah Anda buat.</p>
        </div>
      </div>
      <Card>
        <CardHeader><HistoryHeader totalRecords={pagination?.total_records} /></CardHeader>
        <CardContent>
          <HistoryContent
            isLoading={isLoading}
            error={error}
            pengaduan={pengaduan}
            pagination={pagination}
            onPageChange={setCurrentPage}
            onRetry={() => fetchPengaduan(currentPage)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

