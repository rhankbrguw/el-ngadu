import type { PengaduanWithPelapor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ComplaintAction from "./ComplaintAction";
import { getStatusVariant, formatDate, formatStatus } from "@/lib/complaintUtils";

interface ComplaintCardsProps {
  pengaduanList: PengaduanWithPelapor[];
}

export default function ComplaintCards({ pengaduanList }: ComplaintCardsProps) {
  const list = Array.isArray(pengaduanList) ? pengaduanList : [];

  return (
    <div className="grid gap-3 md:hidden">
      {list.map((item) => (
        <Card key={item.id} className="border shadow-2xs">
          <CardContent className="p-3.5 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">#{item.id}</span>
              <div className="flex items-center gap-1.5">
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
                <Badge variant={getStatusVariant(item.status)} className="text-[11px]">
                  {formatStatus(item.status)}
                </Badge>
              </div>
            </div>

            <h3 className="mb-1.5 text-sm font-semibold text-foreground line-clamp-2">
              {item.judul}
            </h3>

            <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {item.kecamatan && (
                <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground/80">
                  📍 {item.kecamatan}
                </span>
              )}
              <span>• Oleh: <strong className="text-foreground/90">{item.nama_pelapor}</strong></span>
              <span>• {formatDate(item.created_at)}</span>
            </div>

            <ComplaintAction id={item.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
