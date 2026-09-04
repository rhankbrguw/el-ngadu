import { useManageComplaints } from "@/hooks/useManageComplaints";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ClipboardList } from "lucide-react";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import ComplaintTable from "@/components/complaints/ComplaintTable";
import ComplaintCards from "@/components/complaints/ComplaintCards";
import { ComplaintFilterBar } from "@/components/complaints/ComplaintFilterBar";
import DataTablePagination from "@/components/common/DataTablePagination";
import { APP_MESSAGES } from "@/lib/constants/messages";

interface ComplaintListContentProps {
  pengaduan: ReturnType<typeof useManageComplaints>["pengaduan"];
  isDesktop: boolean | null;
}

const ComplaintListContent = ({ pengaduan, isDesktop }: ComplaintListContentProps) => {
  if (pengaduan.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center">
        <ClipboardList className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
        <p className="text-muted-foreground font-medium">{APP_MESSAGES.COMPLAINT.EMPTY || "Tidak ada data pengaduan."}</p>
      </div>
    );
  }
  if (isDesktop) return <ComplaintTable pengaduanList={pengaduan} />;
  return <div className="p-3"><ComplaintCards pengaduanList={pengaduan} /></div>;
};

const ManageComplaintsHeader = () => (
  <div className="flex items-center gap-4 mb-2">
    <ClipboardList className="h-7 w-7 text-primary" />
    <div className="space-y-0.5">
      <h2 className="text-xl font-bold tracking-tight">{APP_MESSAGES.COMPLAINT.MANAGE_TITLE}</h2>
      <p className="text-sm text-muted-foreground">Daftar semua pengaduan yang masuk dari masyarakat.</p>
    </div>
  </div>
);

const ManageComplaintsSkeleton = () => (
  <div className="space-y-3 p-4">
    <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
  </div>
);

const ComplaintErrorState = ({ error }: { error: string }) => (
  <div className="p-5 text-center bg-destructive/10 rounded-lg">
    <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
    <p className="mt-2 font-semibold text-destructive">{APP_MESSAGES.COMMON.ERROR}</p>
    <p className="text-sm text-muted-foreground">{error}</p>
  </div>
);

export default function ManageComplaintsPage() {
  const {
    pengaduan, pagination, setCurrentPage,
    filters, availableKecamatan, updateFilter, isLoading, error
  } = useManageComplaints();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleReset = () => {
    updateFilter("q", "");
    updateFilter("status", "all");
    updateFilter("kecamatan", "all");
  };

  if (isDesktop === null) return <ManageComplaintsSkeleton />;
  if (error) return <ComplaintErrorState error={error} />;

  return (
    <div className="space-y-3.5">
      <ManageComplaintsHeader />
      <ComplaintFilterBar filters={filters} availableKecamatan={availableKecamatan} onFilterChange={updateFilter} onReset={handleReset} />
      <Card>
        <CardContent className="p-0">
          {isLoading ? <ManageComplaintsSkeleton /> : <ComplaintListContent pengaduan={pengaduan} isDesktop={isDesktop} />}
        </CardContent>
        <DataTablePagination pagination={pagination} onPageChange={setCurrentPage} />
      </Card>
    </div>
  );
}

