import { toast } from "sonner";
import { getReportService } from "@/services/reportService";
import { useFetchData } from "@/hooks/useFetchData";
import { exportToCsv } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, FileSpreadsheet, Download } from "lucide-react";
import { ReportTable } from "@/components/reports/ReportTable";
import ReportCards from "@/components/reports/ReportCards";

export default function ReportsPage() {
  const {
    data: laporanList,
    isLoading,
    error,
    refetch,
  } = useFetchData(getReportService);

  const handleExport = () => {
    if (laporanList && laporanList.length > 0) {
      const date = new Date().toISOString().slice(0, 10);
      const filename = `laporan-el-ngadu-${date}.csv`;
      const dataToExport = laporanList.map((item) => ({
        "ID Pengaduan": item.id,
        Judul: item.judul,
        "Isi Pengaduan": item.isi.replace(/\n/g, " "),
        Status: item.status,
        "Tanggal Pengaduan": item.tgl_pengaduan,
        "NIK Pelapor": item.nik_pelapor,
        "Nama Pelapor": item.nama_pelapor,
        "ID Response": item.id_tanggapan,
        "Tanggal Response": item.tgl_tanggapan,
        "Isi Response": item.isi_tanggapan
          ? item.isi_tanggapan.replace(/\n/g, " ")
          : "",
        "Nama Penanggap": item.nama_petugas_penanggap,
      }));
      exportToCsv(filename, dataToExport);
      toast.success("Report berhasil diekspor!");
    } else {
      toast.error("Tidak ada data untuk diekspor.");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-5 text-center bg-destructive/10 rounded-lg">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-2 font-semibold text-destructive">
            Gagal Memuat Data
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="mt-4"
          >
            Coba Lagi
          </Button>
        </div>
      );
    }

    if (!laporanList || laporanList.length === 0) {
      return (
        <div className="text-center py-12">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Belum ada data laporan
          </p>
          <p className="text-sm text-muted-foreground">
            Data akan muncul setelah ada pengaduan yang masuk.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="block lg:hidden">
          <ReportCards laporanList={laporanList} />
        </div>
        <div className="hidden lg:block">
          <ReportTable laporanList={laporanList} />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-3 p-4 sm:p-4 lg:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <FileSpreadsheet className="h-7 w-7 text-primary flex-shrink-0" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Generate Report</h2>
            <p className="text-muted-foreground">
              Rekapitulasi semua pengaduan dan tanggapan.
            </p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          disabled={!laporanList || laporanList.length === 0}
          className="w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Cetak Report (CSV)</span>
          <span className="sm:hidden">Cetak CSV</span>
        </Button>
      </div>
      {renderContent()}
    </div>
  );
}
