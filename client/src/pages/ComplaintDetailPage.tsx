import { Link } from "react-router-dom";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { ComplaintInfoCard } from "@/components/complaint-detail/ComplaintInfoCard";
import { PhotoProofCard } from "@/components/complaint-detail/PhotoProofCard";
import { ResponseCard } from "@/components/complaint-detail/ResponseCard";
import { OfficerActionPanel } from "@/components/complaint-detail/OfficerActionPanel";

export default function ComplaintDetailPage() {
  const {
    user,
    pengaduan,
    isLoading,
    error,
    refetch,
    isSubmitting,
    isiResponse,
    setIsiResponse,
    handleStatusChange,
    handleResponseSubmit,
  } = useComplaintDetail();

  if (isLoading) {
    return (
      <div className="flex justify-center p-5">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !pengaduan) {
    return (
      <div className="text-center p-5 bg-destructive/10 rounded-lg max-w-md mx-auto">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <p className="mt-4 font-semibold text-destructive">
          {error || "Data tidak ditemukan."}
        </p>
        <Button asChild variant="link" className="mt-4" onClick={refetch}>
          <Link to="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
      <div className="lg:col-span-2 space-y-3">
        <ComplaintInfoCard pengaduan={pengaduan} />
        {pengaduan.foto_bukti && (
          <PhotoProofCard fotoUrl={pengaduan.foto_bukti} />
        )}
      </div>

      <div className="lg:col-span-1 space-y-3">
        <ResponseCard tanggapan={pengaduan.tanggapan} />
        {user?.userType === "petugas" && (
          <OfficerActionPanel
            pengaduan={pengaduan}
            isSubmitting={isSubmitting}
            isiResponse={isiResponse}
            onStatusChange={handleStatusChange}
            onResponseSubmit={handleResponseSubmit}
            onIsiResponseChange={setIsiResponse}
          />
        )}
      </div>
    </div>
  );
}
