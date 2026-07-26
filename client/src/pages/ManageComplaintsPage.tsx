import { useManageComplaints } from "@/hooks/useManageComplaints";
import {
 Card,
 CardContent,
} from "@/components/ui/card";
import { AlertCircle, ClipboardList } from "lucide-react";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import ComplaintTable from "@/components/complaints/ComplaintTable";
import ComplaintCards from "@/components/complaints/ComplaintCards";
import DataTablePagination from "@/components/common/DataTablePagination";
import { APP_MESSAGES } from "@/lib/constants/messages";


export default function ManageComplaintsPage() {
 const {
   pengaduan,
   pagination,
   setCurrentPage,
   isLoading,
   error
 } = useManageComplaints();
 const isDesktop = useMediaQuery("(min-width: 768px)");

 if (isLoading || isDesktop === null) {
 return (
 <div className="space-y-4 mt-6">
 <Skeleton className="h-16 w-full" />
 <Skeleton className="h-16 w-full" />
 <Skeleton className="h-16 w-full" />
 <Skeleton className="h-16 w-full" />
 </div>
 );
 }

 if (error) {
 return (
 <div className="p-5 text-center bg-destructive/10 rounded-lg">
 <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
 <p className="mt-2 font-semibold text-destructive">Gagal Memuat Data</p>
 <p className="text-sm text-muted-foreground">{error}</p>
 </div>
 );
 }

  const renderContent = () => {
    if (pengaduan.length === 0) {
      return (
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground font-medium">{APP_MESSAGES.COMPLAINT.EMPTY || "Tidak ada data pengaduan."}</p>
        </div>
      );
    }
    return isDesktop ? (
      <ComplaintTable pengaduanList={pengaduan} />
    ) : (
      <div className="p-4">
        <ComplaintCards pengaduanList={pengaduan} />
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 mb-4">
        <ClipboardList className="h-7 w-7 text-primary" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">{APP_MESSAGES.COMPLAINT.MANAGE_TITLE}</h2>
          <p className="text-muted-foreground">
            Daftar semua pengaduan yang masuk dari masyarakat.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          {renderContent()}
        </CardContent>
 <DataTablePagination
 pagination={pagination}
 onPageChange={setCurrentPage}
 />
 </Card>
 </div>
 );
}
