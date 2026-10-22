import type { Report } from "@/types";
import { useNavigate } from "react-router-dom";
import { APP_MESSAGES } from "@/lib/constants/messages";
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
import { FileText, User as UserIcon, MessageSquare, ShieldCheck, Clock } from "lucide-react";

interface ReportTableProps {
  laporanList: Report[];
}

export function ReportTable({ laporanList }: ReportTableProps) {
  const navigate = useNavigate();
  const list = Array.isArray(laporanList) ? laporanList : [];
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="text-center w-64 h-10 py-1">Pengaduan</TableHead>
            <TableHead className="text-center w-40 h-10 py-1">{APP_MESSAGES.COMPLAINT.REPORTER}</TableHead>
            <TableHead className="text-center w-28 h-10 py-1">{APP_MESSAGES.COMPLAINT.STATUS}</TableHead>
            <TableHead className="text-center w-72 h-10 py-1">Response</TableHead>
            <TableHead className="text-center w-40 h-10 py-1">Penanggap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item) => (
            <TableRow
              key={`laporan-${item.id}-${item.id_tanggapan || "null"}`}
              className="group cursor-pointer hover:bg-muted/60 transition-colors"
              onClick={() => navigate(`/dashboard/complaints/${item.id}`)}
            >

              <TableCell className="text-center align-middle py-2">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="font-semibold text-sm line-clamp-1 text-center text-wrap break-words">{item.judul}</p>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDate(item.tgl_pengaduan)}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center align-middle py-2">
                <div className="inline-flex flex-col items-center justify-center gap-0.5 font-medium text-sm">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[9rem]">{item.nama_pelapor}</span>
                </div>
              </TableCell>
              <TableCell className="text-center align-middle py-2">
                <Badge variant={getStatusVariant(item.status)} className="whitespace-nowrap text-xs px-1.5 py-0">
                  {formatStatus(item.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-center align-middle py-2">
                {item.isi_tanggapan ? (
                  <div className="mx-auto flex flex-col items-center justify-center gap-1.5 bg-muted/30 p-2 rounded border border-border/50 max-w-[16rem]">
                    <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="text-sm text-foreground line-clamp-2 leading-snug text-wrap break-words text-center">{item.isi_tanggapan}</p>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic text-xs">Belum ditanggapi</span>
                )}
              </TableCell>
              <TableCell className="text-center align-middle py-2">
                {item.nama_petugas_penanggap ? (
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <div className="inline-flex items-center gap-1.5 font-medium text-sm">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate max-w-[9rem]">{item.nama_petugas_penanggap}</span>
                    </div>
                    {item.tgl_tanggapan && (
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDate(item.tgl_tanggapan)}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
