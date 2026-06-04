import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Report } from "@/types";
import { REPORT_STRINGS } from "@/lib/constants/reports";
import { formatDate } from "@/lib/complaintUtils";

// Declare module to avoid TS error
declare module "jspdf" {
 interface jsPDF {
 autoTable: (options: Record<string, unknown>) => jsPDF;
 lastAutoTable: {
 finalY: number;
 };
 }
}

export const generatePdfReport = (data: Report[]) => {
 const doc = new jsPDF("landscape");
 
 // Header
 doc.setFontSize(18);
 doc.setFont("helvetica", "bold");
 doc.text(REPORT_STRINGS.PDF_TITLE, 14, 20);
 
 doc.setFontSize(12);
 doc.setFont("helvetica", "normal");
 doc.text(REPORT_STRINGS.PDF_SUBTITLE, 14, 28);
 
 // Line separator
 doc.setLineWidth(0.5);
 doc.line(14, 32, 280, 32);

 // Table
 const tableData = data.map((item) => [
 item.id,
 item.tgl_pengaduan ? formatDate(item.tgl_pengaduan) : "-",
 item.judul,
 item.kategori || "-",
 item.status.toUpperCase(),
 item.nama_pelapor,
 item.nama_petugas_penanggap || "-"
 ]);

 autoTable(doc, {
 startY: 40,
 head: [
 [
 REPORT_STRINGS.TABLE_COL_ID,
 REPORT_STRINGS.TABLE_COL_TGL,
 REPORT_STRINGS.TABLE_COL_JUDUL,
 REPORT_STRINGS.TABLE_COL_KATEGORI,
 REPORT_STRINGS.TABLE_COL_STATUS,
 REPORT_STRINGS.TABLE_COL_PELAPOR,
 "Petugas"
 ]
 ],
 body: tableData,
 theme: "grid",
 headStyles: { fillColor: [41, 128, 185] },
 styles: { fontSize: 9 },
 columnStyles: {
 0: { cellWidth: 15 },
 1: { cellWidth: 30 },
 2: { cellWidth: 60 },
 3: { cellWidth: 40 },
 4: { cellWidth: 25 },
 5: { cellWidth: 40 },
 6: { cellWidth: 40 }
 }
 });

 // Footer & Signature
 const finalY = doc.lastAutoTable.finalY + 20;
 
 doc.setFontSize(10);
 doc.text(`${REPORT_STRINGS.PDF_FOOTER}${formatDate(new Date().toISOString())}`, 14, doc.internal.pageSize.getHeight() - 10);
 
 // Signature block on the right
 const pageWidth = doc.internal.pageSize.getWidth();
 doc.text("Jakarta, " + formatDate(new Date().toISOString()), pageWidth - 60, finalY);
 doc.setFont("helvetica", "bold");
 doc.text(REPORT_STRINGS.PDF_SIGNATURE_TITLE, pageWidth - 60, finalY + 5);
 doc.text(REPORT_STRINGS.PDF_SIGNATURE_ROLE, pageWidth - 60, finalY + 10);
 
 // Space for signature
 doc.line(pageWidth - 60, finalY + 35, pageWidth - 14, finalY + 35);
 doc.setFont("helvetica", "normal");
 doc.text("NIP. 19800101 200501 1 001", pageWidth - 60, finalY + 40);

 doc.save(`Laporan_ElNgadu_${new Date().getTime()}.pdf`);
};
