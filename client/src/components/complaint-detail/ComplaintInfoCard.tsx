import type { PengaduanDetail } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin, Tag } from "lucide-react";
import {
 getStatusVariant,
 formatDate,
 formatStatus,
} from "@/lib/complaintUtils";

interface ComplaintInfoCardProps {
 pengaduan: PengaduanDetail;
}

export function ComplaintInfoCard({ pengaduan }: ComplaintInfoCardProps) {
  const fullLocation = [pengaduan.lokasi, pengaduan.kelurahan, pengaduan.kecamatan].filter(Boolean).join(", ");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={getStatusVariant(pengaduan.status)}>
            {formatStatus(pengaduan.status)}
          </Badge>
          {pengaduan.prioritas && (
            <Badge variant={pengaduan.prioritas === "darurat" ? "destructive" : pengaduan.prioritas === "rendah" ? "outline" : "secondary"}>
              Prioritas: {pengaduan.prioritas ? pengaduan.prioritas.charAt(0).toUpperCase() + pengaduan.prioritas.slice(1) : "-"}
            </Badge>

          )}
        </div>
        <CardTitle className="text-xl">{pengaduan.judul}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{pengaduan.nama_pelapor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(pengaduan.created_at)}
              {pengaduan.tanggal_kejadian && ` (Kejadian: ${formatDate(pengaduan.tanggal_kejadian)})`}
            </span>
          </div>
          {pengaduan.kategori && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <span>{pengaduan.kategori}</span>
            </div>
          )}
          {fullLocation && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{fullLocation}</span>
            </div>
          )}
        </div>
      </CardHeader>
 <CardContent>
 <div className="bg-muted/30 p-4 rounded-md border border-border/50">
 <p className="whitespace-pre-wrap leading-relaxed">{pengaduan.isi}</p>
 </div>
 </CardContent>
 </Card>
 );
}
