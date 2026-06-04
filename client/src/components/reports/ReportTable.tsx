import type { Report } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import {
 Card, CardContent } from "@/components/ui/card";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
 getStatusVariant,
 formatDate,
 formatStatus,
} from "@/lib/complaintUtils";

interface ReportTableProps {
 laporanList: Report[];
}

export function ReportTable({ laporanList }: ReportTableProps) {
 return (
 <Card>
 <CardContent className="p-0">
 <div className="overflow-x-auto">
 <Table className="min-w-[1000px]">
 <TableHeader>
 <TableRow>
 <TableHead className="text-center w-[300px]">Pengaduan</TableHead>
 <TableHead className="text-center w-[180px]">{APP_MESSAGES.COMPLAINT.REPORTER}</TableHead>
 <TableHead className="text-center w-[120px] text-center">{APP_MESSAGES.COMPLAINT.STATUS}</TableHead>
 <TableHead className="text-center w-[300px]">Response</TableHead>
 <TableHead className="text-center w-[180px]">Penanggap</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {laporanList.map((item) => (
 <TableRow
 key={`laporan-${item.id}-${item.id_tanggapan || "null"}`}
 >
 <TableCell className="text-center">
 <p className="font-medium">{item.judul}</p>
 <p className="text-xs text-muted-foreground">
 {formatDate(item.tgl_pengaduan)}
 </p>
 </TableCell>
 <TableCell className="text-center">{item.nama_pelapor}</TableCell>
 <TableCell className="text-center">
 <Badge variant={getStatusVariant(item.status)}>
 {formatStatus(item.status)}
 </Badge>
 </TableCell>
 <TableCell className="text-center text-sm">
 {item.isi_tanggapan || (
 <span className="text-muted-foreground italic">
 Belum ditanggapi
 </span>
 )}
 </TableCell>
 <TableCell className="text-center">
 <p>{item.nama_petugas_penanggap || "-"}</p>
 {item.tgl_tanggapan && (
 <p className="text-xs text-muted-foreground">
 {formatDate(item.tgl_tanggapan)}
 </p>
 )}
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 </CardContent>
 </Card>
 );
}
