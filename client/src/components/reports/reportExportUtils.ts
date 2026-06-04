import { toast } from "sonner";
import { exportToCsv } from "@/lib/utils";
import { generatePdfReport } from "@/lib/pdfGenerator";
import { REPORT_STRINGS } from "@/lib/constants/reports";

export const handleExportCSV = (filteredData: Record<string, unknown>[]) => {
 if (filteredData.length > 0) {
 const date = new Date().toISOString().slice(0, 10);
 const filename = `laporan-el-ngadu-${date}.csv`;
 const dataToExport = filteredData.map((item) => ({
 "ID Pengaduan": item.id,
 "Judul": item.judul,
 "Isi Pengaduan": item.isi.replace(/\n/g, " "),
 "Kategori": item.kategori || "-",
 "Status": item.status,
 "Tanggal Pengaduan": item.tgl_pengaduan,
 "NIK Pelapor": item.nik_pelapor,
 "Nama Pelapor": item.nama_pelapor,
 "ID Response": item.id_tanggapan,
 "Tanggal Response": item.tgl_tanggapan,
 "Isi Response": item.isi_tanggapan ? item.isi_tanggapan.replace(/\n/g, " ") : "",
 "Nama Penanggap": item.nama_petugas_penanggap,
 }));
 exportToCsv(filename, dataToExport);
 toast.success(REPORT_STRINGS.SUCCESS_EXPORT);
 } else {
 toast.error(REPORT_STRINGS.ERROR_EXPORT);
 }
};

export const handleExportPDF = (filteredData: Record<string, unknown>[]) => {
 if (filteredData.length > 0) {
 try {
 generatePdfReport(filteredData);
 toast.success(REPORT_STRINGS.SUCCESS_EXPORT);
 } catch {
 toast.error("Gagal men-generate PDF.");
 }
 } else {
 toast.error(REPORT_STRINGS.ERROR_EXPORT);
 }
};
