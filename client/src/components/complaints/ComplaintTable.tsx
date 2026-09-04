import type { PengaduanWithPelapor } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ComplaintAction from "./ComplaintAction";
import { getStatusVariant, formatDate, formatStatus } from "@/lib/complaintUtils";

interface ComplaintTableProps {
  pengaduanList: PengaduanWithPelapor[];
}

export default function ComplaintTable({ pengaduanList }: ComplaintTableProps) {
  const list = Array.isArray(pengaduanList) ? pengaduanList : [];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-16">ID</TableHead>
            <TableHead>{APP_MESSAGES.COMPLAINT.TITLE}</TableHead>
            <TableHead className="hidden md:table-cell w-40">Pelapor</TableHead>
            <TableHead className="text-center w-28">{APP_MESSAGES.COMPLAINT.STATUS}</TableHead>
            <TableHead className="text-center hidden lg:table-cell w-36">Tanggal</TableHead>
            <TableHead className="text-center w-36">{APP_MESSAGES.COMMON.ACTION}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-center font-medium">#{item.id}</TableCell>
              <TableCell className="font-medium max-w-[280px]">
                <div className="truncate font-semibold text-foreground">{item.judul}</div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {item.kecamatan && (
                    <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground/80">
                      📍 {item.kecamatan}
                    </span>
                  )}
                  {item.prioritas && (
                    <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold ${
                      item.prioritas === "darurat"
                        ? "bg-destructive/15 text-destructive"
                        : item.prioritas === "rendah"
                        ? "bg-muted text-muted-foreground"
                        : "bg-secondary/25 text-secondary-foreground"
                    }`}>
                      {item.prioritas.toUpperCase()}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell truncate text-sm">
                {item.nama_pelapor}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(item.status)}>
                  {formatStatus(item.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell text-xs text-muted-foreground">
                {formatDate(item.created_at)}
              </TableCell>
              <TableCell className="text-center">
                <ComplaintAction id={item.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
