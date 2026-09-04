import { Link } from "react-router-dom";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ComplaintInfoCard } from "@/components/complaint-detail/ComplaintInfoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoProofCard } from "@/components/complaint-detail/PhotoProofCard";
import { ResponseCard } from "@/components/complaint-detail/ResponseCard";
import { OfficerActionPanel } from "@/components/complaint-detail/OfficerActionPanel";
import { APP_MESSAGES } from "@/lib/constants/messages";


const DetailSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto pb-12">
    <Skeleton className="h-8 w-1/3" />
    <div className="grid gap-6 md:grid-cols-2"><Skeleton className="h-80 w-full" /><Skeleton className="h-80 w-full" /></div>
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

export default function ComplaintDetailPage() {
  const detail = useComplaintDetail();

  if (detail.isLoading) return <DetailSkeleton />;
  if (detail.error || !detail.pengaduan) return <DetailError error={detail.error} onRetry={detail.refetch} />;

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
}

