import { useEffect, useState, useCallback } from "react";
import { getAllPengaduanService } from "@/services/complaintService";
import type { PengaduanWithPelapor, Pagination } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, ClipboardList } from "lucide-react";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import ComplaintTable from "@/components/complaints/ComplaintTable";
import ComplaintCards from "@/components/complaints/ComplaintCards";
import DataTablePagination from "@/components/common/DataTablePagination";

export default function ManageComplaintsPage() {
  const [pengaduan, setPengaduan] = useState<PengaduanWithPelapor[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const fetchPengaduan = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllPengaduanService(page);
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

  if (isLoading || isDesktop === null) {
    return (
      <div className="flex justify-center p-5">
        <Loader2 className="h-8 w-8 animate-spin" />
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 mb-4">
        <ClipboardList className="h-7 w-7 text-primary" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Kelola Pengaduan</h2>
          <p className="text-muted-foreground">
            Daftar semua pengaduan yang masuk dari masyarakat.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          {/* Render satu komponen saja berdasarkan ukuran layar */}
          {isDesktop ? (
            <ComplaintTable pengaduanList={pengaduan} />
          ) : (
            <div className="p-4">
              <ComplaintCards pengaduanList={pengaduan} />
            </div>
          )}
        </CardContent>
        <DataTablePagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
