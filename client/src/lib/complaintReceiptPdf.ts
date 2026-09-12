import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PengaduanDetail } from "@/types";
import { formatDate } from "@/lib/complaintUtils";
import { COMPLAINT_TRACKING_STRINGS } from "@/lib/constants/complaints";

function renderReceiptHeader(doc: jsPDF, pageWidth: number): void {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(COMPLAINT_TRACKING_STRINGS.RECEIPT_TITLE, 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(COMPLAINT_TRACKING_STRINGS.RECEIPT_SUBTITLE, 14, 26);
  doc.setLineWidth(0.5);
  doc.line(14, 30, pageWidth - 14, 30);
}

function buildReceiptRows(p: PengaduanDetail): string[][] {
  const loc = [p.lokasi, p.kelurahan, p.kecamatan].filter(Boolean).join(", ");
  const reply = p.tanggapan ? p.tanggapan.isi_tanggapan : COMPLAINT_TRACKING_STRINGS.NO_REPLY_YET;

  return [
    ["Nomor Tiket", `#${p.id}`],
    ["Waktu Lapor", formatDate(p.created_at)],
    ["Pelapor", p.is_anonim ? "Masyarakat (Anonim)" : p.nama_pelapor],
    ["Judul Laporan", p.judul],
    ["Kategori", p.kategori || "-"],
    ["Tingkat Urgensi", (p.prioritas || "sedang").toUpperCase()],
    ["Wilayah Kejadian", loc || "-"],
    ["Status Terkini", p.status.toUpperCase()],
    ["Isi Pengaduan", p.isi],
    ["Tanggapan Resmi", reply],
  ];
}

export function generateComplaintReceiptPdf(p: PengaduanDetail): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  renderReceiptHeader(doc, doc.internal.pageSize.getWidth());

  autoTable(doc, {
    startY: 36,
    head: [["Informasi", "Rincian"]],
    body: buildReceiptRows(p),
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" }, 1: { cellWidth: "auto" } },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(COMPLAINT_TRACKING_STRINGS.RECEIPT_FOOTER, 14, pageHeight - 12);
  doc.save(`tanda-terima-pengaduan-${p.id}.pdf`);
}
