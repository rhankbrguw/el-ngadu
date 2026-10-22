import { Link } from "react-router-dom";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download } from "lucide-react";
import { ComplaintInfoCard } from "@/components/complaint-detail/ComplaintInfoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoProofCard } from "@/components/complaint-detail/PhotoProofCard";
import { ResponseCard } from "@/components/complaint-detail/ResponseCard";
import { OfficerActionPanel } from "@/components/complaint-detail/OfficerActionPanel";
import { ComplaintStatusStepper } from "@/components/complaint-detail/ComplaintStatusStepper";
import { generateComplaintReceiptPdf } from "@/lib/complaintReceiptPdf";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { COMPLAINT_TRACKING_STRINGS } from "@/lib/constants/complaints";

const DetailSkeleton = () => (
  <div className="space-y-4 max-w-5xl mx-auto pb-12">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-24 w-full" />
    <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-80 w-full" /><Skeleton className="h-80 w-full" /></div>
  </div>
);

const DetailError = ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
  <div className="text-center p-5 bg-destructive/10 rounded-lg max-w-md mx-auto">
    <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
    <p className="mt-4 font-semibold text-destructive">{error || "Data tidak ditemukan."}</p>
    <Button asChild variant="link" className="mt-4" onClick={onRetry}>
      <Link to="/dashboard">{APP_MESSAGES.COMMON.BACK_TO_DASHBOARD}</Link>
    </Button>
  </div>
);

interface HeaderProps {
  id: number;
  pengaduan: ReturnType<typeof useComplaintDetail>["pengaduan"];
}

const ComplaintDetailHeader = ({ id, pengaduan }: HeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      <h1 className="text-xl font-bold">Detail Pengaduan #{id}</h1>
      <p className="text-xs text-muted-foreground mt-0.5">Pantau status dan tindak lanjut pengaduan Anda secara real-time.</p>
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={() => pengaduan && generateComplaintReceiptPdf(pengaduan)}
      className="gap-1.5 w-full sm:w-auto"
    >
      <Download className="h-4 w-4" />
      {COMPLAINT_TRACKING_STRINGS.BTN_DOWNLOAD_RECEIPT}
    </Button>
  </div>
);

interface GridProps {
  detail: ReturnType<typeof useComplaintDetail>;
}

const ComplaintDetailGrid = ({ detail }: GridProps) => {
  if (!detail.pengaduan) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
      <div className="lg:col-span-2 space-y-3">
        <ComplaintInfoCard pengaduan={detail.pengaduan} />
        {detail.pengaduan.foto_bukti && <PhotoProofCard fotoUrl={detail.pengaduan.foto_bukti} />}
      </div>
      <div className="lg:col-span-1 space-y-3">
        <ResponseCard tanggapan={detail.pengaduan.tanggapan} />
        {detail.user?.userType === "petugas" && (
          <OfficerActionPanel
            pengaduan={detail.pengaduan}
            isSubmitting={detail.isSubmitting}
            isiResponse={detail.isiResponse}
            onStatusChange={detail.handleStatusChange}
            onResponseSubmit={detail.handleResponseSubmit}
            onIsiResponseChange={detail.setIsiResponse}
          />
        )}
      </div>
    </div>
  );
};

export default function ComplaintDetailPage() {
  const detail = useComplaintDetail();

  if (detail.isLoading) return <DetailSkeleton />;
  if (detail.error || !detail.pengaduan) return <DetailError error={detail.error} onRetry={detail.refetch} />;

  return (
    <div className="space-y-4">
      <ComplaintDetailHeader id={detail.pengaduan.id} pengaduan={detail.pengaduan} />
      <ComplaintStatusStepper pengaduan={detail.pengaduan} />
      <ComplaintDetailGrid detail={detail} />
    </div>
  );
}
